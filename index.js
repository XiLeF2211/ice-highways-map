const proxyURL = 'https://api.codetabs.com/v1/proxy/?quest='
const mapURL = 'https://map.earthmc.net/tiles'
const highwaysURL = 'https://raw.githubusercontent.com/XiLeF2211/Cosmic-Reach-Localization/eab6f86f841f6bb2819639b31e0f2926177dd2d4/assets/base/highways.json'

let highwayData

const towns = []
const townLabels = []

let viewHistory = []

let selectedStation

const map = L.map('mapa', {
    crs: L.CRS.Simple,
    center: [0, 0],
    attributionControl: false,
    preferCanvas: true,
    noWrap: true
}).setView([0, 0], 1);
map.zoomControl.setPosition('topright')

L.tileLayer(proxyURL + mapURL + '/minecraft_overworld/{z}/{x}_{y}.png', {
    maxNativeZoom: 3,
    minNativeZoom: 0,
    maxZoom: 19
}).addTo(map);

init();

async function init() {
    highwayData = await fetchJSON(highwaysURL)
    if (!highwayData) {
        console.log('debug: There was a problem with getting station and line data')
    }
    await renderTowns();
    renderLines();
    renderStations();
    listLine()
    listStation();
}

async function renderTowns() {
    const startTownRender = new Date()
    const data = await fetchJSON(proxyURL + mapURL + '/minecraft_overworld/markers.json')
    if (!data || data[0].markers.length == 0) {
        console.log('debug: There was a problem with getting towns data')
        return
    }
    
    const regions = []
    
    // Collect info about towns
    for (const town of data[0].markers) {
        if (town.type != 'polygon') continue
        
        const townName = town.tooltip.match(/<b>(.*)<\/b>/)[1]
        const nation = town.tooltip.match(/\(\b(?:Member|Capital)\b of (.*)\)\n/)?.at(1)
        
        // Might need capital? maybe
        let isCapital = town.tooltip.search(/\(Capital of /)
        const fill = town.fillColor
        const outline = town.color ?? fill
        for (const region of town.points) {
            const vertices = []
            for (const vertex of region[0]) {
                vertices.push([-vertex.z / 16, vertex.x / 16])
            }
            
            if (regions.find(region => region.town == townName)) isCapital = false
            regions.push({
                town: townName,
                nation: nation,
                vertices: vertices,
                fill: fill,
                outline: outline,
                isCapital: isCapital
            })
        }
    }
    
    // Place down every collected town
    for (const region of regions) {
        L.polygon(region.vertices, {
            fillColor: region.fill,
            color: region.outline,
            weight: 1
        }).addTo(map).bindPopup(region.town + (region.nation != undefined ? ', ' + region.nation : ''))
    }
    
    const stopTownRender = new Date()
    const diff = stopTownRender - startTownRender
    console.log(`debug: Rendering towns took ${diff}ms`)
}

async function renderLines() {
    const startLineRender = new Date()
    
    for (const company of Object.keys(highwayData.lines)) {
        for (const line of Object.keys(highwayData.lines[company])) {
            // Modify vertices
            const vertices = []
            for (const branch of highwayData.lines[company][line].vertices) {
                vertices.push([])
                for (const vertex of branch) {
                    vertices[vertices.length - 1].push([-vertex[1] / 16, vertex[0] / 16])
                }
            }
            
            let container = document.createElement('div');
            let lineName = document.createElement('a')
            lineName.innerHTML = line
            lineName.style.cursor = 'pointer'
            lineName.addEventListener('click', () => {
                openSide();
                showLine(company, line, highwayData.lines[company][line]);
                viewHistory.push(['line', company, line, highwayData.lines[company][line]])
            })
            container.appendChild(lineName)
            L.polyline(vertices, {
                color: '#' + highwayData.lines[company][line].color,
                weight: 5
            })
            .addTo(map)
            .bindPopup(container)
        }
    }
    
    const stopLineRender = new Date()
    console.log(`debug: Rendering lines took ${stopLineRender - startLineRender}ms`)
}

async function renderStations() {
    const startStationRender = new Date()
    
    for (const station of highwayData.stations) {
        let container = document.createElement('div');
        let stationName = document.createElement('a')
        stationName.innerHTML = station.name
        stationName.style.cursor = 'pointer'
        stationName.addEventListener('click', () => {
            openSide();
            showStation(station);
            viewHistory.push(['station', station])
        })
        container.appendChild(stationName)
        
        L.circleMarker([-station.z / 16, station.x / 16], {
            radius: 5,
            color: '#ffffff'
        })
        .addTo(map)
        .bindPopup(container)
    }
    
    const stopStationRender = new Date()
    console.log(`debug: Rendering stations took ${stopStationRender - startStationRender}ms`)
}

function listLine() {
    for (const company of Object.keys(highwayData.lines)) {
        for (const line of Object.keys(highwayData.lines[company])) {
            let lineItem = document.createElement('dt')
            let lineName = document.createElement('a')
            lineName.innerHTML = `${line} (${company})`
            lineItem.style.cursor = 'pointer'
            lineItem.addEventListener('click', () => {
                showLine(company, line, highwayData.lines[company][line])
                viewHistory.push(['line', company, line, highwayData.lines[company][line]])
            })
            lineItem.appendChild(lineName)
            document.getElementById('line-list').appendChild(lineItem)
        }
    }
}

function listStation() {
    for (const station of highwayData.stations) {
        let stationItem = document.createElement('dt')
        let stationName = document.createElement('a')
        stationName.innerHTML = station.name
        stationItem.style.cursor = 'pointer'
        stationItem.addEventListener('click', () => {
            showStation(station)
            viewHistory.push(['station', station])
        })
        stationItem.appendChild(stationName)
        document.getElementById('station-list').appendChild(stationItem)
    }
}

function getArea(vertices) {
    const n = vertices.length
    let area = 0
    
    // Vertices need rounding to 16 because data has imprecise coordinates
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        area += roundTo16(vertices[i].x) * roundTo16(vertices[j].z)
        area -= roundTo16(vertices[j].x) * roundTo16(vertices[i].z)
    }
    
    return (Math.abs(area) / 2) / (16 * 16)
}

async function fetchJSON(url) {
    const response = await fetch(url)
    if (response.ok) return response.json()
        else return null
}

function roundTo16(number) {
    return Math.round(number / 16) * 16
}

function openSide() {
    document.getElementById('sidebar').style.transform = 'translateX(0%)'
}

function closeSide() {
    document.getElementById('sidebar').style.transform = 'translateX(-200%)'
}

function showLine(companyName, lineName, line) {
    goToTab('line')
    goToDetails('line')
    
    document.getElementById('line-name').textContent = companyName + ': ' + lineName + ' line'
    document.getElementById('line-y').textContent = `y-level (ice block level) at ${line.y}`
    document.getElementById('line-stations').innerHTML = ''
    for (const station of line.stations) {
        let stations = document.createElement('a')
        stations.addEventListener('click', () => {
            showStation(highwayData.stations[station])
            viewHistory.push(['station', highwayData.stations[station]])
        })
        stations.innerHTML = `${line.code}${highwayData.stations[station].lines[companyName][lineName]} ${highwayData.stations[station].name}<br>`
        document.getElementById('line-stations').appendChild(stations)    
    }
}

function showStation(station) {
    goToTab('station')
    goToDetails('station')
    
    document.getElementById('station-name').textContent = station.name
    document.getElementById('station-location').textContent = `X: ${station.x} Z: ${station.z}`
    document.getElementById('station-codes').innerHTML = ''
    for (company in station.lines) {
        let companyName = document.createElement('h3')
        companyName.textContent = company
        document.getElementById('station-codes').appendChild(companyName)
        for (line in station.lines[company]) {
            let code = document.createElement('p')
            let lineLink = document.createElement('a')
            lineLink.addEventListener('click', () => {
                showLine(company, line, highwayData.lines[company][line])
                viewHistory.push(['line', company, line, highwayData.lines[company][line]])
            })
            lineLink.innerHTML = `(${line} line)`
            code.innerHTML = `${highwayData.lines[company][line].code}${station.lines[company][line]} `
            code.appendChild(lineLink)
            document.getElementById('station-codes').appendChild(code)
        }
    }
}

function goToTab(tab) {
    document.getElementById('main').style.display = tab == 'main' ? 'block' : 'none'
    document.getElementById('line').style.display = tab == 'line' ? 'block' : 'none'
    document.getElementById('station').style.display = tab == 'station' ? 'block' : 'none'
    document.getElementById('settings').style.display = tab == 'settings' ? 'block' : 'none'
    
    tab == 'main' ? document.getElementById('about-tab').classList.add('active') : document.getElementById('about-tab').classList.remove('active')
    tab == 'line' ? document.getElementById('line-tab').classList.add('active') : document.getElementById('line-tab').classList.remove('active')
    tab == 'station' ? document.getElementById('station-tab').classList.add('active') : document.getElementById('station-tab').classList.remove('active')
    tab == 'settings' ? document.getElementById('settings-tab').classList.add('active') : document.getElementById('settings-tab').classList.remove('active')
}

function goToList(tab) {
    document.getElementById(tab + '-list-container').style.display = 'block'
    document.getElementById(tab + '-details').style.display = 'none'
}

function goToDetails(tab) {
    document.getElementById(tab + '-list-container').style.display = 'none'
    document.getElementById(tab + '-details').style.display = 'block'
}

function goBackHistory() {
    const temp = viewHistory[viewHistory.length - 2]
    if (temp[0] == 'station') {
        showStation(temp[1])
    } else if (temp[0] == 'line') {
        showLine(temp[1], temp[2], temp[3])
    } else if (temp == 'station-list') {
        goToTab('station')
        goToList('station')
    } else if (temp == 'line-list') {
        goToTab('line')
        goToList('line')
    }
    viewHistory.pop();
}

document.getElementById('about-tab').addEventListener('click', () => {
    goToTab('main')
})

document.getElementById('station-tab').addEventListener('click', () => {
    goToTab('station')
    goToList('station')
    viewHistory = ['station-list']
})

document.getElementById('line-tab').addEventListener('click', () => {
    goToTab('line')
    goToList('line')
    viewHistory = ['line-list']
})

document.getElementById('settings-tab').addEventListener('click', () => {
    goToTab('settings')
})