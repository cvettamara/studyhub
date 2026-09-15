"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface Location {
    id: number
    user_id: number
    name: string
    description: string
    latitude: number
    longitude: number
    image_url: string | null
    created_at: string
    user_name: string
    user_surname: string
    avg_rating: string | null
    ratings_count: string
    rated_by_me: boolean
}

interface LeafletMapProps {
    locations: Location[]
}

export default function LeafletMap({ locations }: LeafletMapProps) {
    const center: [number, number] =
        locations.length > 0
            ? [locations[0].latitude, locations[0].longitude]
            : [41.9981, 21.4254]

    return (
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc) => {
                    const avgRating = loc.avg_rating
                        ? parseFloat(loc.avg_rating)
                        : 0

                    return (
                        <Marker
                            key={loc.id}
                            position={[loc.latitude, loc.longitude]}
                        >
                            <Popup>
                                <div className="min-w-[220px] max-w-[280px]">

                                    {loc.image_url && (
                                        <img
                                            src={loc.image_url}
                                            alt={loc.name}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                    )}

                                    <h3 className="text-base font-bold text-slate-800 mb-1">
                                        {loc.name}
                                    </h3>

                                    <p className="text-sm text-slate-600 mb-3">
                                        {loc.description}
                                    </p>

                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-yellow-500">⭐</span>

                                        <span className="font-semibold text-slate-700">
                                            {avgRating > 0 ? avgRating.toFixed(1) : "No rating"}
                                        </span>

                                        {avgRating > 0 && (
                                            <span className="text-xs text-slate-500">
                                                ({loc.ratings_count})
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        Added by{" "}
                                        <span className="font-medium">
                                            {loc.user_name} {loc.user_surname}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}