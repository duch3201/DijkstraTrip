import { useState } from "react"
import { dijkstra } from "./dijkstraModule"
import './App.css'

const cities = [
  "Bydgoszcz",
  "Toruń",
  "Gdańsk",
  "Łódź",
  "Warszawa",
  "Wrocław",
  "Katowice"
];

const directConnections = {
  "Bydgoszcz": ["Toruń", "Gdańsk"],
  "Toruń": ["Bydgoszcz", "Gdańsk", "Łódź"],
  "Gdańsk": ["Bydgoszcz", "Toruń", "Łódź"],
  "Łódź": ["Gdańsk", "Toruń", "Warszawa", "Wrocław"],
  "Warszawa": ["Łódź", "Katowice"],
  "Wrocław": ["Łódź", "Katowice"],
  "Katowice": ["Łódź", "Warszawa", "Wrocław"]
};

function generateDirectPairs(connections) {
  const pairs = [];
  const visited = new Set();

  for (const city in connections) {
    for (const neighbor of connections[city]) {
      const key1 = city + "_" + neighbor;
      const key2 = neighbor + "_" + city;

      if (!visited.has(key1) && !visited.has(key2)) {
        pairs.push([city, neighbor]);
        visited.add(key1);
        visited.add(key2);
      }
    }
  }

  return pairs;
}

function App() {
  const [travelTimes, setTravelTimes] = useState(() => {
    const initial = {};
    generateDirectPairs(directConnections).forEach(([c1, c2]) => {
      initial[`${c1}_${c2}`] = ""; 
    });
    return initial;
  });
  const [citiesTraveled, setCitiesTraveled] = useState([])
  const [totalTravelTime, setTotalTravelTime] = useState(0)
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")

  function handleChange(pairKey, value) {
    if (value === "" || /^[0-9]*$/.test(value)) { 
      setTravelTimes((prev) => ({
        ...prev,
        [pairKey]: value
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
   
    const graph = {};
    cities.forEach(city => (graph[city] = {}));

    for (const [pairKey, time] of Object.entries(travelTimes)) {
      if (time === "" || Number(time) <= 0) continue; 

      const [c1, c2] = pairKey.split("_");
      const t = Number(time);

      graph[c1][c2] = t;
      graph[c2][c1] = t;
    }

    console.log(startPoint, endPoint)

    console.log("Graph ready for algorithm:", graph);
    const outputDijkstra = dijkstra(graph, startPoint, endPoint);
    console.log(outputDijkstra)
    setCitiesTraveled(outputDijkstra.path)
    setTotalTravelTime(outputDijkstra.cost)
  }


  return (
    <div id="app" className="tiktok-sans-glob">
      <div id="sidebar">
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <h2 className="tiktok-sans-h2">Enter travel times (minutes)</h2>
          {generateDirectPairs(directConnections).map(([c1, c2]) => {
            const key = `${c1}_${c2}`;
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                <label id="sidebarTexts">
                  <div style={{"min-width":"178px"}}>
                    {c1} → {c2} &nbsp;
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input"
                      value={travelTimes[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder="minutes"
                      required
                      style={{ width: 80 }}
                      />
                  </div>
                </label>
              </div>
            );
          })}
          <div id="cityandstart">
            <label htmlFor="startCity">Start</label>
            <select name="startCity" id="startCity" className="tiktok-sans-glob" value={startPoint} onChange={(e) => setStartPoint(e.target.value)}>
              {cities.map(city => {
                return <option value={city}>{city}</option>
              })}
            </select>
            <label htmlFor="endCity">Destination</label>
            <select name="endCity" id="endCity" className="tiktok-sans-glob" value={endPoint} onChange={(e) => setEndPoint(e.target.value)}>
              {cities.map(city => {
                return <option value={city}>{city}</option>
              })}
            </select>                   
            <button className="tiktok-sans-glob button" type="submit" style={{ marginTop: 20 }}>Save Travel Times</button>
          </div>
        </form>
      </div>
      <div id="results">
        <h3 style={{ marginBottom: "10px" }} className="tiktok-sans-h3">Shortest Route</h3>
        {citiesTraveled.map((city, index) => (
          <div key={city} style={{ paddingLeft: `${index * 20}px` }}>
            {index === 0 ? city : `↳ ${city}`}
          </div>
        ))}
        <br />
        <span>Total travel time: {totalTravelTime} minutes</span>
      </div>
    </div>
  );
}

export default App
