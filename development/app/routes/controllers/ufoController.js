'use strict'

const _return500 = (e, res) => {
  console.log(e)
  res.status(500).json({'error': 'something wrong'})
  res.end()
}

const _validateLonParam = (lon, res) => {
  const isValidLon = (lon >= -180) && (lon <= 180)
  if (!isValidLon) {
    res.status(422).json({'message': 'Longtitude must more then -180 and less then 180.'})
    res.end()
  }
}

const _validateLatParam = (lat, res) => {
  const isValidLat = (lat >= 0) && (lat <= 90)
  if (!isValidLat) {
    res.status(422).json({'message': 'Lattitude must more then -180 and less then 180.'})
    res.end()
  }
}

const howManyUFO = async(req, res) => {
  try {
    const collection = db.collection('ufo_coll')
    const countRes   = await collection.countDocuments()
  	res.status(200).json({"count": countRes})
  	res.end()  	
  } catch (e) {
    _return500(e, res)
  }
}

const howAdvancedIsTheFleet = async(req, res) => {  
  try {  
    const collection = db.collection('ufo_coll')
    const shapes     = await collection.distinct('shape')
    console.log(shapes.length)
    const notAShape   = ['other', 'unknown']
    const validShapes = shapes.filter(item => {
      return !notAShape.includes(item)          
    })
    
    res.status(200).json({"count": validShapes.length})
    res.end()
  } catch (e) {
    _return500(e, res)
  }    
}

const evacuationPriorities = async(req, res) => {   
  const allowedCountries = [ 'us', 'notDefined', 'ca', 'gb', 'au', 'de' ]

  const _validateLimitParam = (limit, res) => {
    let _lim = Number(limit)
    const isValidLimit = (_lim > 0) && (_lim < 100)
    if (!isValidLimit) {
      res.status(422).json({'message': 'Limit must be more then 0 and less then 100.'})
      res.end()
    } else {
      return _lim
    }
  }

  const _validateCountryParam = (country, res) => {
    const isValidCountry = allowedCountries.includes(country)
    if (!isValidCountry) {
      res.status(422).json({'message': `Country options: ${allowedCountries}`})
      res.end()
    } else {
      if (country === 'notDefined') {
        return ''
      }
      return country
    }
  }

  try {
    const collection = db.collection('ufo_coll')
    const country      = req.query.country || 'us'
    const limit        = req.query.limit || 10

    let validCountry = _validateCountryParam(country, res)
    let validLimit   = _validateLimitParam (limit, res)

    const result = await collection.aggregate([
      { $match: { country: validCountry } },
      { $group: {_id: '$city', count: { $sum: 1 } } },
      { $project: { _id:0, city: '$_id', count: '$count' } } ,
      { $sort: { count: -1 } },
      { $limit: validLimit } 
    ])
    .toArray()
         
    res.status(200).json({ 'sightings': result })
    res.end()

  } catch (e) {
    _return500(e, res)
  }
}

const oneIfByLand = async(req, res) => {
  const _validateNumParam = (num, res) => {
    const isValidNum = (num > 0) && (num <= 100)
      if (!isValidNum) {
        res.status(422).json({'message': 'Number must be more then 0 and less then 100.'})
        res.end()
      }
  }

  try {
    const collection = db.collection('ufo_coll')
    let lon          = req.query.lon || -87.3956
    let lat          = req.query.lat || 46.5476
    let num          = req.query.num || 3
    lon              = parseFloat(lon)
    lat              = parseFloat(lat)
    num              = parseInt(num)

    _validateLonParam(lon, res)
    _validateLatParam(lat, res)
    _validateNumParam(num, res)

    const result = await collection.aggregate([
      { $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "dist.calculated",
          minDistance: 2,
          num: num,
          spherical: true
        }
      },
      { $sort: { 'dist.calculated': 1 } },
      { $project: { 
          _id: 0,
          city: '$city',
          country: '$country',
          state: '$state',
          id: '$id',
          occurred_at: '$occurred_at',
          duration_seconds: '$duration_seconds',
          duration_text: '$duration_text',
          reported_on: '$reported_on',
          description: '$description',
          coordinates: '$coordinates', 
          shape: '$shape',
          distance: { $trunc: '$dist.calculated' }
        }
      }
    ])
    .toArray()    

    res.status(200).json({ 'sightings': result })
    res.end()

  } catch (e) {
    _return500(e, res)
  }    
}

const railyTheTroops = async(req, res) => {
  const _convertArrToObj = (result) => {
    return result && result[0] && result[0].shape ? result.reduce((obj, item) => {
      return obj[item.shape] = item.count, obj
    }, {}) : result
  }

  const _validateMaxDistParam = (maxDistance, res) => {
    const isValidDist = (maxDistance > 3) && (maxDistance <= 20000000)
      if (!isValidDist) {
        res.status(422).json({'message': 'Max distance must be more then 3m and less then 20.000.000m.'})
        res.end()
      }
  }

  const _validateDurationParam = (duration, res) => {
    const isValidDur = (duration > 1) && (duration <= 22000)
      if (!isValidDur) {
        res.status(422).json({'message': 'Max duration must be more then 1s and less then 22000s.'})
        res.end()
      }
  }

  try {
    const collection = db.collection('ufo_coll')
    let lon          = req.query.lon     || -87.3956
    let lat          = req.query.lat     || 46.5476
    let maxDistance  = req.query.maxDist || 120000
    let duration     = req.query.dur     || 42
    lon              = parseFloat(lon)
    lat              = parseFloat(lat)
    maxDistance      = parseInt(maxDistance)
    duration         = parseInt(duration)

    req.query.lon     && _validateLonParam(lon, res)
    req.query.lat     && _validateLatParam(lat, res)
    req.query.maxDist && _validateMaxDistParam(maxDistance, res)
    req.query.dur     && _validateDurationParam(duration, res)

    const result = await collection.aggregate([
      { $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "dist.calculated",
          minDistance: 2,
          maxDistance: maxDistance,
          limit: 1000,
          spherical: true
        }
      },
      { $match: { duration_seconds: { $gt: 42} } },
      { $group: {_id: '$shape', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, shape: '$_id', count: '$count' }}      
    ])
    .toArray()

    const finalRes = _convertArrToObj(result)

    res.status(200).json({ 'targets': finalRes })
    res.end()
  } catch (e) {
    _return500(e, res)
  } 
}

module.exports = {
  howManyUFO,
  howAdvancedIsTheFleet,
  evacuationPriorities,
  oneIfByLand,
  railyTheTroops 
}
