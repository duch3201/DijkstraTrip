import { Heap } from 'heap-js';

export function dijkstra(graph, start, end) {    
    const heap = new Heap((a, b) => a.cost - b.cost);

    const shortestTimes = {[start]:0}
    heap.push({city:start, cost:0, path:[start]})


    while (!heap.isEmpty()) {
        const { city, cost, path } = heap.pop();
        
        if (city === end) {
            return { cost, path }
        }
        
        for (const neighbor in graph[city]) {
            const travelTime = graph[city][neighbor];
            const newCost = cost + travelTime
            
            if (shortestTimes[neighbor] === undefined || newCost < shortestTimes[neighbor]) {
                shortestTimes[neighbor] = newCost;
                heap.push({city: neighbor, cost: newCost, path: [...path, neighbor]})
            }
        }
    }
    return null;
}


