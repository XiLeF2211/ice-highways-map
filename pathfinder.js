class Pathfinder {
    constructor(data) {
        this.graph = {};
        let stations = data.stations;
        let errorMessage = document.getElementById("data-error");

        for (let station of stations) {
            let reachable = {};
            for (let company in station.lines) {
                if (station.lines[company] == null) {
                    errorMessage.innerText = `Error: station ${station.id} (${station.name}) has null lines for company ${company}`;
                    continue;
                }
                for (let line in station.lines[company]) {
                    let branches = [station.lines[company][line][1]];
                    // console.log(station.id + " " + company + " " + line + " " + branches);
                    if (!branches[0].startsWith("connection to ") && branches[0].includes(" to ")) branches = branches[0].split(" to ", 2);
                    if (!branches[0].startsWith("connection to ") && branches[0].includes(" and ")) branches = branches[0].split(" and ");
                    for (let branch of branches) {
                        // console.log(data.lines[company][line].branches[branch])
                        // console.log(data.lines[company][line].branches)
                        // console.log(branch)
                        if (data.lines[company][line].branches[branch].stations == null) {
                            errorMessage.innerText = `Error: line ${company}.${line}.${branch} has null stations (station ${station.id} (${station.name}))`;
                            continue;
                        }
                        let branchStations = data.lines[company][line].branches[branch].stations.flat();
                        let actualStations = [];
                        branchStations.forEach(element => {
                            if (typeof element !== "string") actualStations.push(element);
                        });
                        // console.log(actualStations);
                        let index = actualStations.indexOf(station.id);
                        if (index == -1) {
                            errorMessage.innerText = `Error: station ${station.id} (${station.name}) not found in line ${company}.${line}.${branch} stations`;
                            continue;
                        }
                        let n = actualStations.length;
                        // console.log(station.id + " " + company + " " + line + " " + branch + " " + index);
                        if (n > 1) {
                            if (index == 0)
                                reachable[stations[actualStations[1]].id] = [Math.abs(station.x - stations[actualStations[1]].x) + Math.abs(station.z - stations[actualStations[1]].z), `${company}: ${line}: ${branch}`];
                            else if (index == n - 1) 
                                reachable[stations[actualStations[n - 2]].id] = [Math.abs(station.x - stations[actualStations[n - 2]].x) + Math.abs(station.z - stations[actualStations[n - 2]].z), `${company}: ${line}: ${branch}`];
                            else {
                                reachable[stations[actualStations[index + 1]].id] = [Math.abs(station.x - stations[actualStations[index + 1]].x) + Math.abs(station.z - stations[actualStations[index + 1]].z),`${company}: ${line}: ${branch}`];
                                reachable[stations[actualStations[index - 1]].id] = [Math.abs(station.x - stations[actualStations[index - 1]].x) + Math.abs(station.z - stations[actualStations[index - 1]].z), `${company}: ${line}: ${branch}`];
                            }
                        }
                    }
                }
            }
            // console.log(reachable);
            this.graph[station.id] = reachable;
        }
    }

    // start and end are station IDs
    pathfind(start, end) {
        if (!Object.keys(this.graph).length) {
            console.log("debug: graph is empty");
            return null;
        }

        const visited = [start];
        const distances = { [start]: 0 };
        const previous = { [start]: null };

        while (!Object.keys(distances).includes(end) && visited.length) {
            let current = visited.pop();
            let children = this.graph[current];
            for (let child in children) {
                let distance = this.graph[current][child][0] + distances[current];
                if (!Object.keys(distances).includes(child) || distance < distances[child]) {
                    distances[child] = distance;
                    visited.push(child);
                    previous[child] = [Number(current), this.graph[current][child][1]];
                }
            }
        }

        const path = [];

        console.log(previous);
        for (let at = [end, previous[end][1]]; at != null; at = previous[at[0]]) {
            path.push(at);
        }

        return [path.reverse(), distances[end]];
    }
}