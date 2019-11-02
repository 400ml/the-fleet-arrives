# Evacuation Priorities

```bash
⇒  curl http://localhost:<port>/<route>?<query-string>
{
  "sightings": [
    {
        "city": <city_name_with_most_sightings:string>,
        "count": <sightings_in_this_city:int>
    },
    {
        "city": <city_name_with_second_most_sightings:string>,
        "count": <sightings_in_this_city:int>
    },
    ...
    ...
    {
        "city": <city_name_with_tenth_most_sightings:string>,
        "count": <sightings_in_this_city:int>
    }
  ]
}
```
