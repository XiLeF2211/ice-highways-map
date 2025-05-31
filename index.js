const proxyURL = 'https://api.codetabs.com/v1/proxy/?quest='
const mapURL = 'https://map.earthmc.net/tiles'

const towns = []
const townLabels = []

const map = L.map('mapa', {
    crs: L.CRS.Simple,
    center: [0, 0],
    attributionControl: false,
    preferCanvas: true,
    noWrap: true
}).setView([0, 0], 1);
L.tileLayer(proxyURL + mapURL + '/minecraft_overworld/{z}/{x}_{y}.png', {
    maxNativeZoom: 3,
    minNativeZoom: 0,
    maxZoom: 19
}).addTo(map);

renderTowns();

async function renderTowns() {
    const startTownRender = new Date()
    const data = await fetchJSON(proxyURL + mapURL + '/minecraft_overworld/markers.json')
    if (!data || data[0].markers.length == 0) {
        console.log('[Dynglobe] There was a problem with getting towns data')
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
    console.log(`[Dynglobe] Rendering towns took ${diff}ms`)
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