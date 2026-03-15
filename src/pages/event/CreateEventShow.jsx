import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import { createEventShow, fetchEvent } from "../../store/event/eventThunk"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
})

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng)
    }
  })
  return null
}

function ChangeMapView({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 15)
    }
  }, [coords])
  return null
}

export default function CreateEventShow() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { eventId } = useParams()

  const { event } = useSelector(state => state.event)
  const { user } = useSelector(state => state.auth)

  const [location, setLocation] = useState(null)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [venueName, setVenueName] = useState("")
  const [address, setAddress] = useState("")
  const [capacity, setCapacity] = useState("")
  const [times, setTimes] = useState([""])
  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(fetchEvent(eventId))
  }, [dispatch, eventId])

  useEffect(() => {
    if (event && user && event.organizer_id !== user.id) {
      navigate("/my-events")
    }
  }, [event, user])

  const searchLocation = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json&addressdetails=1`
    )
    const data = await res.json()
    setResults(data)
  }

  const selectPlace = (place) => {
    const coords = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    }

    setLocation(coords)
    setVenueName(place.display_name.split(",")[0])
    setAddress(place.display_name)
    setResults([])
  }

  const addTime = () => {
    setTimes([...times, ""])
  }

  const updateTime = (value, index) => {
    const updated = [...times]
    updated[index] = value
    setTimes(updated)
  }

  const validateTimes = () => {
    if (!event) return false

    const duration = event.estimated_duration_minutes
    const buffer = 15

    const parsedTimes = times
      .filter(t => t)
      .map(t => new Date(t))
      .sort((a,b)=>a-b)

    for (let i = 0; i < parsedTimes.length - 1; i++) {
      const currentEnd = new Date(parsedTimes[i].getTime() + (duration + buffer) * 60000)
      if (parsedTimes[i+1] < currentEnd) {
        return false
      }
    }

    return true
  }

  const submit = () => {
    setError(null)

    if (!location) {
      setError("Please select venue location")
      return
    }

    if (!validateTimes()) {
      setError("Show times conflict with duration + 15 min buffer")
      return
    }

    const payload = {
      event_id: eventId,
      venue: {
        name: venueName,
        formatted_address: address,
        latitude: location.lat,
        longitude: location.lng
      },
      capacity: Number(capacity),
      start_times: times
    }

    dispatch(createEventShow(payload))
     navigate(`/event-layout/${event.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Select Venue</h2>

          {event && (
            <div className="text-sm text-gray-400 mb-4">
              Event: <span className="text-white font-semibold">{event.title}</span>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venue..."
              className="flex-1 bg-[#2a2a2a] p-3 rounded-lg outline-none"
            />
            <button
              onClick={searchLocation}
              className="bg-pink-600 px-6 rounded-lg"
            >
              Search
            </button>
          </div>

          {results.length > 0 && (
            <div className="bg-[#2a2a2a] rounded-lg mb-4 max-h-40 overflow-y-auto">
              {results.map((r,i)=>(
                <div
                  key={i}
                  onClick={()=>selectPlace(r)}
                  className="p-3 border-b border-gray-700 hover:bg-[#3a3a3a] cursor-pointer"
                >
                  {r.display_name}
                </div>
              ))}
            </div>
          )}

          <MapContainer
            center={[20.5937,78.9629]}
            zoom={5}
            className="h-[400px] rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
            <ChangeMapView coords={location} />
            {location && <Marker position={[location.lat, location.lng]} />}
          </MapContainer>

        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-xl space-y-6">

          <h2 className="text-2xl font-bold">Show Details</h2>

          <div>
            <label className="text-gray-400 text-sm">Venue Name</label>
            <input
              value={venueName}
              onChange={(e)=>setVenueName(e.target.value)}
              className="w-full mt-1 bg-[#2a2a2a] p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Address</label>
            <textarea
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
              className="w-full mt-1 bg-[#2a2a2a] p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e)=>setCapacity(e.target.value)}
              className="w-full mt-1 bg-[#2a2a2a] p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Show Times</label>

            {times.map((t,i)=>(
              <input
                key={i}
                type="datetime-local"
                value={t}
                onChange={(e)=>updateTime(e.target.value,i)}
                className="w-full mt-2 bg-[#2a2a2a] p-3 rounded-lg outline-none"
              />
            ))}

            <button
              onClick={addTime}
              className="mt-3 text-sm text-pink-400"
            >
              + Add another show
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-bold"
          >
            Create Event Shows
          </button>

        </div>

      </div>
    </div>
  )
}