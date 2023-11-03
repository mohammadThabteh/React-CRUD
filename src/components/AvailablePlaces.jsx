import { useEffect, useState } from 'react'
import Places from './Places.jsx'
import Error from "./Error.jsx"
import { sortPlacesByDistance } from "../loc.js"

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true)
      try {
        const response = await fetch("http://localhost:8080/places")
        const resData = await response.json()

        if (!response.ok) throw new Error("Failed to fetch data....");

        navigator.geolocation.getCurrentPosition(position => {
          const sortedPlaces = sortPlacesByDistance(resData.places, position.coords.latitude, position.coords.longitude)
        })
        setAvailablePlaces(resData.places)
        setIsFetching(false)
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch data, please try later!!!"
        })
        setIsFetching(false)
      }
    }
    fetchPlaces()
  }, [])
  if (error) {
    return <Error title="An Error occured" message={error.message} />
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={"Fetching place data..."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
