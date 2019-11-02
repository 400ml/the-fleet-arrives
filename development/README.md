# Summary

To submit first three issues i imported csv -> mongodb using 'mongo compass'.
To submit the last issue i imported data from csv to mongo collection with geospecial index '2dsphere' for 'coordinates' field.
I used my own manual request validation without any libraries (like Swagger).

## Requirements

0) You must have node, npm, mongodb, curl on your machine and clone my solution from gitHub

1) To clone run the command in terminal

```bash
⇒  git clone https://github.com/400ml/the-fleet-arrives.git
```

2) Go on your machine to `/the-fleet-arrives/development/` and to install dependencies run

```bash
⇒  npm i
```

4) Before importing data check if mongodb is alive. Docs https://docs.mongodb.com/manual/installation/
	To import data from csv -> mongodb

```bash
⇒  npm run seed
```

## Usage

1) To start the server

```bash
⇒  npm run start
```

2) Test API using browser or curl https://curl.haxx.se/download.html Test examples you will find in ANSWERS

## Answers

1) How many sightings are there?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/count'
{
	"count": 80332
}
real	0m0,099s
user	0m0,005s
sys	  0m0,012s
```

2) How many different ships will be attacking?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/unique'
{
	"count":28
}
real	0m0,132s
user	0m0,009s
sys	  0m0,010s
```

3) What are the Top-10 cities in the United States that should be evacuated first?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/priority'
{
	"sightings":[
		{"city":"seattle",    "count":524},
		{"city":"phoenix",    "count":454},
		{"city":"portland",   "count":373},
		{"city":"las vegas",  "count":367},
		{"city":"los angeles","count":352},
		{"city":"san diego",  "count":338},
		{"city":"houston",    "count":297},
		{"city":"chicago",    "count":264},
		{"city":"tucson",     "count":241},
		{"city":"miami",      "count":239}
	]
}
real	0m0,190s
user	0m0,008s
sys	  0m0,012s
```

4) If our secret Area-52 base was to be attacked, where would it come from?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/zone'
{
	"sightings":[
		{
			"city":"marquette",
			"country":"us",
			"state":"mi",
			"id":6084,
			"occurred_at":"6/1/1974 00:00",
			"duration_seconds":300,
			"duration_text":"5 minutes",
			"reported_on":"2/14/2006",
			"description":"We had no idea what it was and did not speak of it for years.",
			"coordinates":[-87.3952778,46.5436111],
			"shape":"oval",
			"distance":444
		},
		{
			"city":"marquette",
			"country":"us",
			"state":"mi",
			"id":14024,
			"occurred_at":"7/31/2008 16:00",
			"duration_seconds":900,
			"duration_text":"15 minutes",
			"reported_on":"8/12/2008",
			"description":"Something awakened me. When I looked out of the deck window at around 4:00 a.m.&#44 I was surprised to see a red flashing light. I live",
			"coordinates":[-87.3952778,46.5436111],
			"shape":"sphere",
			"distance":444
		},
		{
			"city":"marquette",
			"country":"us",
			"state":"mi",
			"id":48068,
			"occurred_at":"8/25/1991 23:00",
			"duration_seconds":3,
			"duration_text":"3 sec",
			"reported_on":"12/14/2004",
			"description":"Second and Third witness to report.",
			"coordinates":[-87.3952778,46.5436111],
			"shape":"",
			"distance":444
		}
	]
}
real	0m0,028s
user	0m0,010s
sys	  0m0,007s
```

5) Find the UFO sightings that the Railgun can successfully shoot down grouped by their shape:

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/troops'
{
  "targets": {
  	"light":38,
  	"triangle":14,
  	"circle":10,
  	"disk":10,
  	"other":8,
  	"fireball":6,
  	"diamond":6,
  	"unknown":6,
  	"formation":4,
  	"sphere":4,
  	"rectangle":2,
  	"changing":2,
  	"flash":2,
  	"cigar":2,
  	"oval":2
  }
}
```

## Ambiguity Notes

3.1) What if I want know the Top-3 cities in the Germany that should be evacuated first?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/priority?country=de&limit=3'
{
	"sightings":[
		{"city":"berlin (germany)", "count":11},
		{"city":"munich (germany)", "count":3},
		{"city":"ansbach (germany)","count":3}
	]
}
real	0m0,104s
user	0m0,016s
sys	  0m0,004s
```
3.2) And what about Top-3 cities in the "NoNameCountry" that should be evacuated first?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/priority?country=notDefined&limit=3'
{
	"sightings":[
		{"city":"washington&#44 d.c.","count":77},
		{"city":"uk/england","count":58},
		{"city":"port st. lucie","count":35}
	]
}
real	0m0,125s
user	0m0,014s
sys	  0m0,005s
```
OMG!! Washington under the impact! o_O

4.1) If our secret Area-53(-75.97897, 43.9879) base was to be attacked, where would it come from?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/zone?lon=-75.97897&lat=43.9879&num=3'
{
	"sightings":[
		{
			"city":"watertown",
			"country":"us",
			"state":"ny",
			"id":1758,
			"occurred_at":"2/28/2012 22:20",
			"duration_seconds":3,
			"duration_text":"about 3 sec",
			"reported_on":"3/13/2012",
			"description":"Saw a blue ball of light falling from the sky&#44 turned green before fading away. ((NUFORC Note:  Possible meteor.  PD))",
			"coordinates":[-75.9111111,43.9747222],
			"shape":"light","
			distance":5630
		},
		{
			"city":"watertown",
			"country":"us",
			"state":"ny",
			"id":6202,
			"occurred_at":"12/26/2003 13:30",
			"duration_seconds":420,
			"duration_text":"6-7 minutes",
			"reported_on":"1/17/2004",
			"description":"Five Objects Seen in Sky over Watertown&#44 New York",
			"coordinates":[-75.9111111,43.9747222],
			"shape":"formation",
			"distance":5630
		},
		{
			"city":"watertown",
			"country":"us",
			"state":"ny",
			"id":49268,
			"occurred_at":"8/13/2011 00:45",
			"duration_seconds":240,
			"duration_text":"4 minutes",
			"reported_on":"8/21/2011",
			"description":"I seen multiple objects with flashing lights&#44 one flew over my house and over me and my girlfriend.",
			"coordinates":[-75.9111111,43.9747222],
			"shape":"unknown",
			"distance":5630
		}
	]
}
real	0m0,044s
user	0m0,019s
sys	  0m0,000s
```

4.2) What if I want to know about thousands of ships?

```bash
⇒  time curl 'http://localhost:8000/ufo/sightings/zone?lon=-75.97897&lat=43.9879&num=20000'
{
	"message":"Number must be more then 0 and less then 100."
}
real	0m0,042s
user	0m0,010s
sys	  0m0,007s
```
