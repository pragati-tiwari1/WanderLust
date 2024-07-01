

mapboxgl.accessToken = mapToken
  const map = new mapboxgl.Map({
      container: "map", // container ID
      style : "mapbox://styles/mapbox/streets-v12",
      center: listing.geometry.coordinates, // starting position [longitude, latitude]
      zoom: 8// starting zoom
  });


  //MAP MARKER-> TO SHOW SPECIFIC LOCATION

  
  const marker = new mapboxgl.Marker({color : "red"})
  .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
  .setPopup(new mapboxgl.Popup({offset:25}) //marker popup
  .setHTML(`<h4>${listing.title} </h4>
  <p>Exact location will be provided after booking</p>`))
  .addTo(map)