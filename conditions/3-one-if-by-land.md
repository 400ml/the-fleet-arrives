# One if by Land

```bash
⇒  curl http://localhost:<port>/<route>?<query-string>
{
  "sightings": [
    {
        "city": <city_closest_to_base:string>,
        "country": <country_of_city:string>,
        ...
        ...
        "shape": <shape_of_ufo:string>,
        "distance": <distance_of_ufo_from_area52:float>
    },
    {
        "city": <city_second_closest:string>,
        "country": <country_of_city:string>,
        ...
        ...
        "shape": <shape_of_ufo:string>,
        "distance": <distance_of_ufo_from_area52:float>
    },
    {
        "city": <city_third_closest:string>,
        "country": <country_of_city:string>,
        ...
        ...
        "shape": <shape_of_ufo:string>,
        "distance": <distance_of_ufo_from_area52:float>
    }
  ]
}
```
