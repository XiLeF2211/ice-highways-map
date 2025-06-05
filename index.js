const proxyURL = 'https://api.codetabs.com/v1/proxy/?quest='
const mapURL = 'https://map.earthmc.net/tiles'
const highwaysURL = 'https://raw.githubusercontent.com/XiLeF2211/ice-highways-map/refs/heads/main/highways.json'

let highwayData

let marker = L.marker([0, 0])

let viewHistory = []
let selectedStation
let stationFilters = {
    contains: '',
    type: ['station', 'semi', 'jct', 'inter']
}
let lineFilters = {
    contains: '',
    company: []
}

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
    lineFilterOpts();
    listLine()
    listStation();

    await renderTowns();
    renderLines();
    renderStations();
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
            const lineData = highwayData.lines[company][line]
            // Modify vertices
            for (const branch of Object.keys(lineData.branches)) {
                const vertices = []
                for (const vertex of lineData.branches[branch].vertices) {
                    vertices.push([-vertex[1] / 16, vertex[0] / 16])
                }

                let container = document.createElement('div');
                let lineName = document.createElement('a')
                lineName.innerHTML = `${line} line <em>${branch != '' ? `(${branch})` : ''}</em>`
                lineName.style.cursor = 'pointer'
                lineName.addEventListener('click', () => {
                    openSide();
                    showLine(company, line, lineData);
                    viewHistory.push(['line', company, line, lineData])
                })
                container.appendChild(lineName)
                L.polyline(vertices, {
                    color: '#' + lineData.color,
                    weight: 5
                })
                    .addTo(map)
                    .bindPopup(container)
            }
        }
    }

    for (const company of Object.keys(highwayData.lines)) {
        for (const line of Object.keys(highwayData.lines[company])) {
            const lineData = highwayData.lines[company][line]

            for (const branch of Object.keys(lineData.branches)) {
                if (Object.hasOwn(lineData.branches[branch], 'concurrencies')) {
                    for (const concurrency of Object.keys(lineData.branches[branch].concurrencies)) {
                        console.log(concurrency)
                        const shift = lineData.branches[branch].concurrencies[concurrency].pop()
                        const concurrentVertices = []
                        for (const vertex of lineData.branches[branch].concurrencies[concurrency]) {
                            concurrentVertices.push([-vertex[1] / 16, vertex[0] / 16])
                        }

                        let concurrencyContainer = document.createElement('div')
                        let ogLine = document.createElement('a')
                        ogLine.innerHTML = `${line} line <em>${branch != '' ? `(${branch})` : ''}</em><br>`
                        ogLine.style.cursor = 'pointer'
                        ogLine.addEventListener('click', () => {
                            openSide();
                            showLine(company, line, lineData);
                            viewHistory.push(['line', company, line, lineData])
                        })

                        let concurrentWith = document.createElement('a')
                        concurrentWith.innerHTML = `concurrent with ${concurrency.split('.')[1]}`
                        concurrentWith.addEventListener('click', () => {
                            openSide();
                            showLine(concurrency.split('.')[0], concurrency.split('.')[1], highwayData.lines[concurrency.split('.')[0]][concurrency.split('.')[1]])
                            viewHistory.push(['line', concurrency.split('.')[0], concurrency.split('.')[1], highwayData.lines[concurrency.split('.')[0]][concurrency.split('.')[1]]])
                        })
                        concurrencyContainer.appendChild(ogLine)
                        concurrencyContainer.appendChild(concurrentWith)

                        L.polyline(concurrentVertices, {
                            color: '#' + lineData.color,
                            weight: 5,
                            offset: 1
                        })
                            .addTo(map)
                            .bindPopup(concurrencyContainer)
                    }
                }
            }
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

        if (Object.hasOwn(station, 'type')) L.marker([-station.z / 16, station.x / 16], {
                icon: L.icon({
                    iconUrl: 'assets/symbols/' + station.type + '.svg',
                    iconSize: 14
                })
            }).addTo(map).bindPopup(container)
        else L.circleMarker([-station.z / 16, station.x / 16], {
            radius: 5,
            color: '#ffffff'
        })
            .addTo(map)
            .bindPopup(container)
    }

    const stopStationRender = new Date()
    console.log(`debug: Rendering stations took ${stopStationRender - startStationRender}ms`)
}

function showLine(companyName, lineName, line) {
    goToTab('line')
    goToDetails('line')

    document.getElementById('line-name').textContent = companyName + ': ' + lineName + ' line'
    if (line.code.length > 0) document.getElementById('line-code').textContent = `Code: ${line.code}`
    else document.getElementById('line-code').textContent = ''
    document.getElementById('line-y').textContent = `y-level (ice block level) at ${line.y}`
    document.getElementById('line-stations').innerHTML = ''
    for (const branch of Object.keys(line.branches)) {
        let branchName = document.createElement('h3')
        branchName.innerHTML = branch
        document.getElementById('line-stations').appendChild(branchName)

        let branchList = document.createElement('ul')
        for (const station of line.branches[branch].stations) {
            let stationId = Array.isArray(station) ? station[0] : station
            let stationItem = document.createElement('li')
            stationItem.classList.add('station-item')

            let stationName = document.createElement('a')
            let connections = document.createElement('ul')
            connections.classList.add('connections')

            stationName.addEventListener('click', () => {
                showStation(highwayData.stations[stationId])
                viewHistory.push(['station', highwayData.stations[stationId]])
            })
            if (Array.isArray(station)) {
                stationName.innerHTML = `${line.prefix}${highwayData.stations[stationId].lines[companyName][lineName][0]} ${highwayData.stations[stationId].name} <em>(to ${station[1]})</em><br>`
            } else {
                stationName.innerHTML = `${line.prefix}${highwayData.stations[stationId].lines[companyName][lineName][0]} ${highwayData.stations[stationId].name}<br>`
            }

            stationItem.style.setProperty('--line-color', '#' + line.color)

            for (const companyConnection of Object.keys(highwayData.stations[stationId].lines)) {
                for (const connectionLine of Object.keys(highwayData.stations[stationId].lines[companyConnection])) {
                    if (connectionLine == lineName && companyConnection == companyName) continue

                    let connection = document.createElement('li')
                    let badge = document.createElement('span')

                    connection.classList.add('connections_line')
                    badge.classList.add('badge')

                    badge.innerHTML = highwayData.lines[companyConnection][connectionLine].code == "" ? highwayData.lines[companyConnection][connectionLine].prefix + highwayData.stations[stationId][companyConnection][connectionLine][0] : highwayData.lines[companyConnection][connectionLine].code
                    badge.style.backgroundColor = '#' + highwayData.lines[companyConnection][connectionLine].color

                    badge.addEventListener('click', () => {
                        showLine(companyConnection, connectionLine, highwayData.lines[companyConnection][connectionLine])
                        viewHistory.push(['line', companyConnection, connectionLine, highwayData.lines[companyConnection][connectionLine]])
                    })

                    connection.appendChild(badge)
                    connections.appendChild(connection)
                }
            }

            stationItem.appendChild(stationName)
            if (connections.innerHTML != "") stationItem.appendChild(connections)
            branchList.appendChild(stationItem)
        }
        document.getElementById('line-stations').appendChild(branchList)
    }
}

function showStation(station) {
    goToTab('station')
    goToDetails('station')

    document.getElementById('station-name').textContent = station.name
    document.getElementById('station-location').innerHTML = `X: ${station.x} Z: ${station.z} <a onclick="locate(${station.x}, ${station.z})">Locate</a>`
    document.getElementById('station-codes').innerHTML = ''
    for (company in station.lines) {
        let companyName = document.createElement('h3')
        companyName.textContent = company
        document.getElementById('station-codes').appendChild(companyName)
        for (line in station.lines[company]) {
            let code = document.createElement('p')
            code.innerHTML = `${highwayData.lines[company][line].prefix}${station.lines[company][line][0]} `

            let lineLink = document.createElement('a')
            lineLink.addEventListener('click', () => {
                showLine(company, line, highwayData.lines[company][line])
                viewHistory.push(['line', company, line, highwayData.lines[company][line]])
            })
            lineLink.innerHTML = (code.innerText == ' ' ? `${line} line` : `(${line} line)`) + (station.lines[company][line][1] != '' ? ` (${station.lines[company][line][1]})` : '')
            code.appendChild(lineLink)
            document.getElementById('station-codes').appendChild(code)
        }
    }
}

function listLine() {
    document.getElementById('line-list').replaceChildren()
    for (const company of Object.keys(highwayData.lines)) {
        if (!lineFilters.company.includes(company)) continue

        for (const line of Object.keys(highwayData.lines[company])) {
            if (line.toUpperCase().indexOf(lineFilters.contains) < 0) continue

            let lineItem = document.createElement('dt')
            let lineName = document.createElement('a')
            lineName.innerHTML = `${line} line (${company})`
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
    document.getElementById('station-list').replaceChildren()
    for (const station of highwayData.stations) {
        if (station.name.toUpperCase().indexOf(stationFilters.contains) < 0) continue
        if (!stationFilters.type.includes(station.type == undefined ? 'station' : station.type.replace(/[0-9]/g, ''))) continue

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

function filterLines() {
    lineFilters = {
        contains: document.getElementById('search-line').value.toUpperCase(),
        company: checkFilters('line-filter-company')
    }
    listLine()
}

function filterStations() {
    stationFilters = {
        contains: document.getElementById('search-station').value.toUpperCase(),
        type: checkFilters('station-filter-type')
    }
    listStation()
}

function lineFilterOpts() {
    for (const company of Object.keys(highwayData.lines)) {
        let companyInput = document.createElement('input')
        let companyLabel = document.createElement('label')
        companyInput.type = 'checkbox'
        companyInput.id = 'company-' + company
        companyInput.value = company
        companyInput.checked = true
        companyLabel.innerHTML = company
        companyLabel.htmlFor = 'company-' + company

        let temp = document.createElement('div')
        temp.appendChild(companyInput)
        temp.appendChild(companyLabel)
        document.getElementById('line-filter-company').appendChild(temp)

        lineFilters.company.push(company)
    }
}

function checkFilters(filterId) {
    let chosen = []
    document.querySelectorAll(`#${filterId} input[type="checkbox"]`).forEach(option => {
        if (option.checked) chosen.push(option.value)
    })
    return chosen
}

function openFilter(filterName) {
    document.getElementById('filters').style.zIndex = 100
    if (filterName == 'station') {
        document.getElementById('station-filter-container').style.display = 'block'
        document.getElementById('line-filter-container').style.display = 'none'
    } else {
        document.getElementById('station-filter-container').style.display = 'none'
        document.getElementById('line-filter-container').style.display = 'block'
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
    document.getElementById(tab + '-list-container').style.display = 'flex'
    document.getElementById(tab + '-details').style.display = 'none'
}

function goToDetails(tab) {
    document.getElementById(tab + '-list-container').style.display = 'none'
    document.getElementById(tab + '-details').style.display = 'block'
}

function goBackHistory() {
    if (viewHistory.length <= 1) {
        goToTab(viewHistory[0][0] == 'station' ? 'station' : 'line')
        goToList(viewHistory[0][0] == 'station' ? 'station' : 'line')
        viewHistory.pop()
        return
    }
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

function openSide() {
    document.getElementById('sidebar').style.transform = 'translateX(0%)'
}

function closeSide() {
    document.getElementById('sidebar').style.transform = 'translateX(-200%)'
}

function locate(x, z) {
    map.panTo([-z / 16, x / 16])
    marker = L.marker([-z / 16, x / 16]).addTo(map)
}

async function fetchJSON(url) {
    const response = await fetch(url)
    if (response.ok) return response.json()
    else return null
}

function roundTo16(number) {
    return Math.round(number / 16) * 16
}

document.getElementById('mapa').addEventListener('click', () => {
    marker.remove()
})

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

window.addEventListener('click', (e) => {
    if (!document.getElementById('filters').contains(e.target)) document.getElementById('filters').zIndex = -2
})