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
    maxZoom: 15,
    minZoom: -2
}).addTo(map);

init();

async function init() {
    highwayData = JSON.parse(`{
    "stations": [
        {
            "name": "Learmonth",
            "id": 0,
            "x": 20865,
            "z": 4020,
            "lines": {
                "SEAN": {
                    "Purple": ["01", ""]
                }
            }
        },
        {
            "name": "Ashburton",
            "id": 1,
            "x": 21303,
            "z": 4080,
            "lines": {
                "SEAN": {
                    "Purple": ["02", ""],
                    "Green": ["9", "Main line"]
                }
            },
            "areas": [
                [[21302, 4073], [21322, 4088]]
            ]
        },
        {
            "name": "Zekium",
            "id": 2,
            "x": 21618,
            "z": 4268,
            "lines": {
                "SEAN": {
                    "Purple": ["03", ""]
                }
            }
        },
        {
            "name": "Adelaide West",
            "id": 3,
            "x": 22393,
            "z": 4542,
            "lines": {
                "SEAN": {
                    "Purple": ["04", ""]
                }
            }
        },
        {
            "name": "Adelaide South",
            "id": 4,
            "x": 22546,
            "z": 4732,
            "lines": {
                "SEAN": {
                    "Purple": ["05", ""]
                }
            }
        },
        {
            "name": "Aussie",
            "id": 5,
            "x": 23392,
            "z": 4732,
            "lines": {
                "SEAN": {
                    "Purple": ["06", ""]
                }
            }
        },
        {
            "name": "Atocarret",
            "id": 6,
            "x": 25058,
            "z": 4732,
            "lines": {
                "SEAN": {
                    "Purple": ["07", ""]
                }
            }
        },
        {
            "name": "Baark",
            "id": 7,
            "x": 26396,
            "z": 4787,
            "lines": {
                "SEAN": {
                    "Purple": ["08", ""]
                }
            }
        },
        {
            "name": "Morven",
            "id": 8,
            "x": 27003,
            "z": 4886,
            "lines": {
                "SEAN": {
                    "Purple": ["09", ""]
                }
            }
        },
        {
            "name": "Ipswich",
            "id": 9,
            "x": 27912,
            "z": 4682,
            "lines": {
                "SEAN": {
                    "Purple": ["10", ""]
                }
            }
        },
        {
            "name": "Rockhampton",
            "id": 10,
            "x": 28025,
            "z": 4682,
            "lines": {
                "SEAN": {
                    "Purple": ["11", ""]
                }
            }
        },
        {
            "name": "Agra JCT",
            "type": "jct",
            "id": 11,
            "x": 14218,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"],
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Lucknow",
            "id": 12,
            "x": 14518,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Haldwani West Western Ramp",
            "type": "inter2",
            "id": 13,
            "x": 14595,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Haldwani West Eastern Ramp",
            "type": "inter1",
            "id": 14,
            "x": 14636,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Haldwani Mine JCT",
            "id": 15,
            "x": 14785,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line to Haldwani branch"]
                }
            }
        },
        {
            "name": "Haldwani",
            "id": 16,
            "x": 14785,
            "z": -5351,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Haldwani branch"]
                }
            }
        },
        {
            "name": "Ryloth JCT",
            "type": "jct",
            "id": 17,
            "x": 14983,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Canopus",
            "id": 18,
            "x": 15319,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Kathmandu",
            "type": "semi3",
            "id": 19,
            "x": 15636,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Everest JCT",
            "type": "jct",
            "id": 20,
            "x": 16107,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"],
                    "Everest": ["", ""]
                }
            }
        },
        {
            "name": "Sikkim Mine",
            "type": "semi3",
            "id": 21,
            "x": 16134,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Bhutan",
            "id": 22,
            "x": 16557,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Woo North JCT",
            "type": "jct",
            "id": 23,
            "x": 16860,
            "z": -5184,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"],
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Woo Empire JCT",
            "type": "jct",
            "id": 24,
            "x": 16860,
            "z": -5047,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"],
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Woo Empire",
            "id": 25,
            "x": 17095,
            "z": -5047,
            "lines": {
                "TNIH": {
                    "Lower Himalayas": ["", "Main line"]
                }
            }
        },
        {
            "name": "Sahrai JCT",
            "type": "jct",
            "id": 26,
            "x": 14218,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Main line"],
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Galatasaray",
            "id": 27,
            "x": 13684,
            "z": -4686,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Main line"]
                }
            }
        },
        {
            "name": "Vilapur JCT",
            "id": 28,
            "x": 13311,
            "z": -4686,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Main line"],
                    "Meteorville": ["", ""]
                }
            }
        },
        {
            "name": "Ahmehabad Mine JCT",
            "id": 29,
            "x": 12729,
            "z": -4686,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Main line to Gujarat branch"]
                }
            }
        },
        {
            "name": "Karachi",
            "id": 30,
            "x": 12382,
            "z": -4686,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Main line"]
                }
            }
        },
        {
            "name": "Gujarat",
            "id": 31,
            "x": 12729,
            "z": -4310,
            "lines": {
                "TNIH": {
                    "Gujarat": ["", "Gujarat branch"]
                }
            }
        },
        {
            "name": "Meteorville",
            "id": 32,
            "x": 13311,
            "z": -4270,
            "lines": {
                "TNIH": {
                    "Meteorville": ["", ""]
                }
            }
        },
        {
            "name": "Kenovoville",
            "id": 33,
            "x": 13445,
            "z": -4250,
            "lines": {
                "TNIH": {
                    "Meteorville": ["", ""]
                }
            }
        },
        {
            "name": "Armadia",
            "id": 34,
            "x": 13445,
            "z": -4133,
            "lines": {
                "TNIH": {
                    "Meteorville": ["", ""]
                }
            }
        },
        {
            "name": "Delhi-Minada JCT",
            "type": "jct",
            "id": 35,
            "x": 16107,
            "z": -4414,
            "lines": {
                "TNIH": {
                    "Everest": ["", ""],
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Hatune",
            "id": 36,
            "x": 16107,
            "z": -4898,
            "lines": {
                "TNIH": {
                    "Everest": ["", ""]
                }
            }
        },
        {
            "name": "RGB",
            "id": 37,
            "x": 16107,
            "z": -5072,
            "lines": {
                "TNIH": {
                    "Everest": ["", ""]
                }
            }
        },
        {
            "name": "Everest",
            "id": 38,
            "x": 16107,
            "z": -5222,
            "lines": {
                "TNIH": {
                    "Everest": ["", ""]
                }
            }
        },
        {
            "name": "Chittagong Grand JCT",
            "type": "jct",
            "id": 39,
            "x": 16860,
            "z": -4314,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"],
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Temerloh",
            "id": 40,
            "x": 16860,
            "z": -4382,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Bogra JCT",
            "type": "jct",
            "id": 41,
            "x": 16860,
            "z": -4516,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line to Bogra branch"]
                }
            }
        },
        {
            "name": "Naypyidaw",
            "id": 42,
            "x": 16860,
            "z": -4708,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Abercromburg",
            "type": "semi2",
            "id": 43,
            "x": 16860,
            "z": -5401,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Nyingchi Mine",
            "id": 44,
            "x": 16942,
            "z": -5910,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Nyingchi",
            "id": 45,
            "x": 16999,
            "z": -5910,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Main line"]
                }
            }
        },
        {
            "name": "Bogra",
            "id": 46,
            "x": 16809,
            "z": -4516,
            "lines": {
                "TNIH": {
                    "Nyingchi": ["", "Bogra branch"]
                }
            }
        },
        {
            "name": "Pekan",
            "id": 47,
            "x": 18853,
            "z": -846,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Main line"]
                }
            }
        },
        {
            "name": "Singapore Grand",
            "id": 48,
            "x": 18798,
            "z": -772,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Main line"]
                }
            }
        },
        {
            "name": "Singapore City JCT",
            "type": "jct",
            "id": 49, 
            "x": 18798,
            "z": -604,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Main line to Island branch"]
                }
            }
        },
        {
            "name": "York",
            "id": 50,
            "x": 18798,
            "z": -509,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Main line"]
                }
            }
        },
        {
            "name": "York Plaza", 
            "id": 51,
            "x": 18614,
            "z": -604,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Island branch"]
                }
            }
        },
        {
            "name": "York Island",
            "id": 52,
            "x": 18610,
            "z": -491,
            "lines": {
                "Local": {
                    "Singapore City Metro": ["", "Island branch"]
                }
            }
        },
        {
            "name": "Berlin Central",
            "id": 53,
            "x": 2423,
            "z": -9608,
            "cx": [2423, 2424],
            "cz": [-9609, -9608],
            "lines": {
                "Local": {
                    "Ringbahn": ["", ""],
                    "Landonbahn": ["", ""]
                }
            },
            "areas": [
                [[2395, -9670], [2452, -9628]],
                [[2391, -9619], [2456, -9598]],
                [[2447, -9621], [2453, -9596]],
                [[2438, -9623], [2442, -9594]],
                [[2437, -9622], [2443, -9595]],
                [[2436, -9621], [2444, -9596]],
                [[2405, -9623], [2409, -9594]],
                [[2404, -9622], [2410, -9595]],
                [[2403, -9621], [2411, -9596]],
                [[2394, -9621], [2400, -9596]],
                [[2421, -9670], [2426, -9598]]
            ]
        },
        {
            "name": "Lucy Street",
            "id": 54,
            "x": 2598,
            "z": -9736,
            "cz": [-9736, -9737],
            "lines": {
                "Local": {
                    "Ringbahn": ["", ""]
                }
            }
        },
        {
            "name": "Berlin Stadium",
            "id": 55,
            "x": 2456,
            "z": -9851,
            "lines": {
                "Local": {
                    "Ringbahn": ["", ""],
                    "Landonbahn": ["", ""]
                }
            },
            "areas": [
                [[2432, -9860], [2479, -9842]],
                [[2433, -9861], [2478, -9841]]
            ]
        },
        {
            "name": "Schonefeld",
            "id": 56,
            "x": 2119,
            "z": -9850,
            "lines": {
                "Local": {
                    "Ringbahn": ["", ""]
                }
            },
            "notes": "Exit blocked",
            "areas": [
                [[2145, -9843], [2093, -9857]]
            ]
        },
        {
            "name": "Rosenthaler",
            "id": 57,
            "x": 2136,
            "z": -9738,
            "lines": {
                "Local": {
                    "Ringbahn": ["", ""]
                }
            },
            "notes": "Exit blocked",
            "areas": [
                [[2108, -9745], [2164, -9731]]
            ]
        },
        {
            "name": "Alexanderplatz",
            "id": 58,
            "x": 2324,
            "z": -9728,
            "lines": {
                "Local": {
                    "Landonbahn": ["", ""]
                }
            },
            "areas": [
                [[2314, -9740], [2334, -9716]],
                [[2315, -9748], [2333, -9708]],
                [[2316, -9754], [2332, -9702]],
                [[2317, -9759], [2331, -9697]]
            ]
        },
        {
            "name": "Chittagong Grand",
            "id": 59,
            "x": 16863,
            "z": -4314,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "4th Street",
            "id": 60,
            "x": 16781,
            "z": -4314,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Noakahli JCT",
            "type": "jct",
            "id": 61,
            "x": 16625,
            "z": -4378,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Yushiwan (Barisal)",
            "id": 62,
            "x": 16532,
            "z": -4378,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Delhi",
            "id": 63,
            "x": 16008,
            "z": -4414,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Daimon",
            "id": 64,
            "x": 15739,
            "z": -4666,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Daimon-Nishi",
            "id": 65,
            "x": 15307,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Singrauli JCT",
            "type": "jct",
            "id": 66,
            "x": 15255,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Bharatpur JCT",
            "type": "jct",
            "id": 67,
            "x": 14983,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Chronos Union JCT",
            "type": "jct",
            "id": 68,
            "x": 14663,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line to Chronos Union branch"]
                }
            }
        },
        {
            "name": "Sahrai",
            "id": 69,
            "x": 14518,
            "z": -4780,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Agra",
            "id": 70,
            "x": 14218,
            "z": -5127,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Aligarh Mine",
            "type": "semi2",
            "id": 71,
            "x": 14218,
            "z": -5313,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "New Delhi",
            "id": 72,
            "x": 14218,
            "z": -5580,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Himalayas JCT",
            "type": "jct",
            "id": 73,
            "x": 14218,
            "z": -5939,
            "lines": {
                "TNIH": {
                    "Bangla-Caspian": ["", "Main line"]
                }
            }
        },
        {
            "name": "Nová Praha",
            "id": 74,
            "x": 23050,
            "z": 2617,
            "lines": {
                "SEAN": {
                    "Green": ["1", "Main line"]
                },
                "Local": {
                    "New Prague Subway": ["", ""]
                }
            }
        },
        {
            "name": "New Prague Central",
            "id": 75,
            "x": 23021,
            "z": 2550,
            "lines": {
                "Local": {
                    "New Prague Subway": ["", ""]
                }
            }
        },
        {
            "name": "East New Prague",
            "id": 76,
            "x": 23113,
            "z": 2498,
            "lines": {
                "Local": {
                    "New Prague Subway": ["", ""]
                }
            }
        },
        {
            "name": "Darwin Central",
            "id": 77,
            "x": 24104,
            "z": 2215,
            "lines": {
                "Local": {
                    "New Prague Subway": ["", ""]
                }
            }
        },
        {
            "name": "East Darwin",
            "id": 78,
            "x": 24308,
            "z": 2178,
            "lines": {
                "Local": {
                    "New Prague Subway": ["", ""]
                }
            }
        },
        {
            "name": "Ćwierkania",
            "id": 79,
            "x": 23050,
            "z": 2984,
            "lines": {
                "SEAN": {
                    "Green": ["1a", "Main line"]
                }
            }
        },
        {
            "name": "Kimberley Commune",
            "id": 80,
            "x": 22695,
            "z": 2995,
            "lines": {
                "SEAN": {
                    "Green": ["2", "Main line"]
                }
            }
        },
        {
            "name": "Broome",
            "id": 81,
            "x": 22499,
            "z": 3288,
            "lines": {
                "SEAN": {
                    "Green": ["3", ""]
                }
            }
        },
        {
            "name": "Ost-Onslow",
            "id": 82,
            "x": 22499,
            "z": 3410,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Panth Memorial",
            "id": 83,
            "x": 22266,
            "z": 3523,
            "lines": {
                "SEAN": {
                    "Green": ["4a", "Main line"]
                }
            }
        },
        {
            "name": "Pilbakraft Hall",
            "id": 84,
            "x": 22178,
            "z": 3539,
            "lines": {
                "SEAN": {
                    "Green": ["4", "Main line"]
                }
            }
        },
        {
            "name": "Panda_Behr's",
            "type": "semi1",
            "id": 85,
            "x": 22103,
            "z": 3589,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Bambus",
            "id": 86,
            "x": 22023,
            "z": 3589,
            "lines": {
                "SEAN": {
                    "Green": ["5", "Main line"]
                }
            }
        },
        {
            "name": "mirza6744, kingermemli, and DJcraft789's",
            "type": "semi1",
            "id": 87,
            "x": 21943,
            "z": 3589,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Squishy's",
            "type": "semi1",
            "id": 88,
            "x": 21930,
            "z": 3589,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Onslow Station Road Station",
            "id": 89,
            "x": 21841,
            "z": 3589,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Onslow Bay Central",
            "id": 90,
            "x": 21817,
            "z": 3596,
            "lines": {
                "SEAN": {
                    "Green": ["6", "Main line"]
                }
            }
        },
        {
            "name": "Onslow Museum",
            "id": 91,
            "x": 21772,
            "z": 3622,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line"]
                }
            }
        },
        {
            "name": "Cactus",
            "id": 92,
            "x": 21627,
            "z": 3678,
            "lines": {
                "SEAN": {
                    "Green": ["7", "Main line"],
                    "Light blue": ["04", "Main line"]
                }
            },
            "areas": [
                [[21619, 3672], [21628, 3687]],
                [[21653, 3675], [21661, 3690]],
                [[21649, 3698], [21662, 3717]],
                [[21621, 3672], [21629, 3665]],
                [[21629, 3662], [21647, 3668]],
                [[21647, 3666], [21656, 3667]],
                [[21655, 3666], [21656, 3698]]
            ]
        },
        {
            "name": "Karratha",
            "id": 93,
            "x": 21438,
            "z": 3715,
            "lines": {
                "SEAN": {
                    "Green": ["8", "Main line"]
                }
            }
        },
        {
            "name": "Chałk",
            "id": 94,
            "x": 21127,
            "z": 4711,
            "lines": {
                "SEAN": {
                    "Green": ["10", "Main line"]
                }
            }
        },
        {
            "name": "Guriąk",
            "id": 95,
            "x": 21012,
            "z": 5050,
            "lines": {
                "SEAN": {
                    "Green": ["11", "Main line"]
                }
            }
        },
        {
            "name": "Mount Magnet JCT",
            "type": "jct",
            "id": 96,
            "x": 21059,
            "z": 5201,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Main line to Mount Magnet branch"]
                }
            }
        },
        {
            "name": "Mundaring West",
            "id": 97,
            "x": 21261,
            "z": 5781,
            "lines": {
                "SEAN": {
                    "Green": ["12", "Main line"]
                }
            },
            "areas": [
                [[21252, 5742], [21271, 5791]],
                [[21252, 5772], [21294, 5791]]
            ]
        },
        {
            "name": "Mundaring Central",
            "id": 98,
            "x": 21491,
            "z": 5785,
            "lines": {
                "SEAN": {
                    "Green": ["13", "Main line"]
                }
            },
            "areas": [
                [[21465, 5777], [21518, 5793]]
            ]
        },
        {
            "name": "East Mundaring",
            "id": 99,
            "x": 21682,
            "z": 5785,
            "lines": {
                "SEAN": {
                    "Green": ["13a", "Main line"]
                }
            }
        },
        {
            "name": "Onfast West",
            "id": 100,
            "x": 22119,
            "z": 5960,
            "lines": {
                "SEAN": {
                    "Green": ["14", "Main line"]
                }
            }
        },
        {
            "name": "Onfast East",
            "id": 101,
            "x": 22491,
            "z": 6036,
            "lines": {
                "SEAN": {
                    "Green": ["15", "Main line"]
                }
            }
        },
        {
            "name": "Ponti",
            "id": 102,
            "x": 22665,
            "z": 6056,
            "lines": {
                "SEAN": {
                    "Green": ["16", "Main line"]
                }
            }
        },
        {
            "name": "Penrith",
            "id": 103,
            "x": 22838,
            "z": 5563,
            "lines": {
                "SEAN": {
                    "Green": ["17", "Main line"]
                }
            },
            "notes": "Closed"
        },
        {
            "name": "Mount Magnet",
            "id": 104,
            "x": 21514,
            "z": 5201,
            "lines": {
                "SEAN": {
                    "Green": ["-undesignated", "Mount Magnet branch"]
                }
            },
            "notes": "Closed"
        },
        {
            "name": "Kobitoilet",
            "id": 105,
            "x": 22276,
            "z": 3540,
            "lines": {
                "SEAN": {
                    "Light blue": ["01", "Main line"]
                }
            }
        },
        {
            "name": "Liepajā",
            "id": 106,
            "x": 22120,
            "z": 3732,
            "lines": {
                "SEAN": {
                    "Light blue": ["02", "Main line"]
                }
            }
        },
        {
            "name": "Pilbara Parliament",
            "id": 107,
            "x": 21817,
            "z": 3771,
            "lines": {
                "SEAN": {
                    "Light blue": ["03", "Main line"]
                }
            }
        },
        {
            "name": "Newman",
            "id": 108,
            "x": 21982,
            "z": 4192,
            "lines": {
                "SEAN": {
                    "Light blue": ["-undesignated", "Newman branch"]
                }
            }
        },
        {
            "name": "Newman JCT",
            "type": "jct",
            "id": 109,
            "x": 21978,
            "z": 3795,
            "lines": {
                "SEAN": {
                    "Light blue": ["-undesignated", "Main line to Newman branch"]
                }
            }
        },
        {
            "name": "Unnamed station",
            "id": 110,
            "x": 21608,
            "z": 3858,
            "lines": {
                "SEAN": {
                    "Light blue": ["-undesignated", ""]
                }
            },
            "notes": "Closed"
        }
    ],
    "lines": {
        "SEAN": {
            "Purple": {
                "prefix": "PU",
                "code": "PU",
                "color": "a020f0",
                "y": 44,
                "branches": {
                    "": {
                        "vertices": [
                            [28025, 4682],
                            [27329, 4682],
                            [27119, 4886],
                            [26396, 4886],
                            [26396, 4732],
                            [22457, 4732],
                            [22393, 4634],
                            [22393, 4513],
                            [21641, 4268],
                            [21503, 4268],
                            [21331, 4104],
                            [21303, 4104],
                            [21303, 4020],
                            [20865, 4020]
                        ],
                        "stations": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    }
                }
            },
            "Green": {
                "prefix": "G",
                "code": "G",
                "color": "71cc1d",
                "y": 49,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [23050, 2608],
                            [23050, 2995],
                            [22657, 2995],
                            [22657, 3250],
                            [22499, 3250],
                            [22499, 3523],
                            [22178, 3523],
                            [22178, 3549],
                            [22186, 3549],
                            [22186, 3589],
                            [21841, 3589],
                            [21841, 3593],
                            [21825, 3593],
                            [21824, 3596],
                            [21798, 3596],
                            [21737, 3657],
                            [21627, 3657],
                            [21627, 3690],
                            [21572, 3690],
                            [21515, 3715],
                            [21311, 3715],
                            [21311, 4608],
                            [21127, 4608],
                            [21127, 4845],
                            [21012, 4958],
                            [21012, 5062],
                            [21189, 5589],
                            [21212, 5589],
                            [21238, 5617],
                            [21241, 5638],
                            [21257, 5654],
                            [21257, 5776],
                            [21265, 5785],
                            [22013, 5785],
                            [22013, 5959],
                            [22135, 5959],
                            [22135, 5943],
                            [22294, 5943],
                            [22491, 6014],
                            [22491, 6048],
                            [22499, 6056],
                            [22685, 6056],
                            [22838, 5774],
                            [22838, 5557]
                        ],
                        "stations": [74, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 1, 94, 95, [96, "to Mount Magnet branch"], 97, 98, 99, 100, 101, 102, 103]
                    },
                    "Mount Magnet branch": {
                        "vertices": [
                            [21059, 5201],
                            [21514, 5201]
                        ],
                        "stations": [[96, "to Main line"], 104]
                    }
                }
            },
            "Light blue": {
                "prefix": "LB",
                "code": "LB",
                "color": "299de6",
                "y": 60,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [22276, 3540],
                            [22226, 3540],
                            [22200, 3568],
                            [22180, 3610],
                            [22180, 3706],
                            [22154, 3732],
                            [22040, 3732],
                            [21978, 3794],
                            [21978, 3795],
                            [21838, 3795],
                            [21838, 3771],
                            [21817, 3771],
                            [21712, 3716],
                            [21608, 3716],
                            [21608, 3858]
                        ],
                        "stations": [105, 106, 107, 92, [109, "to Newman branch"], 110]
                    },
                    "Newman branch": {
                        "vertices": [
                            [21978, 3795],
                            [21982, 3795],
                            [21982, 4192]
                        ],
                        "stations": [[109, "to Newman branch"], 108]
                    }
                }
            }
        },
        "TNIH": {
            "Lower Himalayas": {
                "prefix": "",
                "code": "LH",
                "color": "aa0044",
                "y": 10,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [14218, -5184],
                            [16860, -5184],
                            [16860, -5047],
                            [17095, -5047]
                        ],
                        "stations": [11, 12, 13, 14, [15, "Haldwani branch"], 17, 18, 19, 20, 21, 22, 23, 24, 25],
                        "concurrencies": {
                            "TNIH.Nyinchi": [
                                [16860, -5184],
                                [16860, -5047],
                                [1, 0]
                            ]
                        }
                    },
                    "Haldwani branch": {
                        "vertices": [
                            [14785, -5184],
                            [14785, -5351]
                        ],
                        "stations": [[15, "Main line"], 16]
                    }
                }
            },
            "Gujarat": {
                "prefix": "",
                "code": "GJ",
                "color": "ff6600",
                "y": 10,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [14218, -4780],
                            [14218, -4686],
                            [12382, -4686]
                        ],
                        "stations": [26, 27, 28, [29, "Gujarat branch"], 30]
                    },
                    "Gujarat branch": {
                        "vertices": [
                            [12729, -4686],
                            [12729, -4310]
                        ],
                        "stations": [[29, "Main line"], 31]
                    }
                }
            },
            "Meteorville": {
                "prefix": "",
                "code": "MV",
                "color": "ffcc00",
                "y": 10,
                "branches": {
                    "": {
                        "vertices": [
                            [13311, -4686],
                            [13311, -4250],
                            [13445, -4250],
                            [13445, -4133]
                        ],
                        "stations": [28, 32, 33, 34]
                    }
                }
            },
            "Everest": {
                "prefix": "",
                "code": "EV",
                "color": "d7e3f4",
                "y": 10,
                "branches": {
                    "": {
                        "vertices": [
                            [16107, -4414],
                            [16107, -5222]
                        ],
                        "stations": [35, 36, 37, 20, 38]
                    }
                }
            },
            "Nyingchi": {
                "prefix": "",
                "code": "NC",
                "color": "aa00d4",
                "y": 10,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [16860, -4314],
                            [16860, -5910],
                            [16999, -5910]
                        ],
                        "stations": [39, 40, [41, "Bogra branch"], 42, 24, 23, 43, 44, 45],
                        "concurrencies": {
                            "TNIH.Lower Himalayas": [
                                [16860, -5047],
                                [16860, -5184],
                                [1, 0]
                            ]
                        }
                    },
                    "Bogra branch": {
                        "vertices": [
                            [16860, -4516],
                            [16809, -4516]
                        ],
                        "stations": [[41, "Main line"], 46]
                    }
                }
            },
            "Bangla-Caspian": {
                "prefix": "",
                "code": "BC",
                "color": "ff0000",
                "y": 10,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [16863, -4314],
                            [16714, -4314],
                            [16714, -4378],
                            [16177, -4378],
                            [16177, -4414],
                            [15953, -4414],
                            [15953, -4588],
                            [15739, -4588],
                            [15739, -4780],
                            [14218, -4780],
                            [14218, -5939]
                        ],
                        "stations": [59, 39, 60, 61, 62, 35, 63, 64, 65, 66, 67, 68, 26, 69, 70, 11, 71, 72, 73]
                    }
                }
            }
        },
        "Local": {
            "Singapore City Metro": {
                "prefix": "",
                "code": "",
                "color": "01b9f1",
                "y": 49,
                "branches": {
                    "Main line": {
                        "vertices": [
                            [18853, -846],
                            [18798, -846],
                            [18798, -509]
                        ],
                        "stations": [47, 48, [49, "Island branch"], 50]
                    },
                    "Island branch": {
                        "vertices": [
                            [18798, -604],
                            [18610, -604],
                            [18610, -491]
                        ],
                        "stations": [[49, "Main line"], 51, 52]
                    }
                }
            },
            "Ringbahn": {
                "prefix": "",
                "code": "",
                "color": "8e2121",
                "y": 1,
                "branches": {
                    "": {
                        "vertices": [
                            [2302, -9744],
                            [2302, -9672],
                            [2321, -9672],
                            [2321, -9613],
                            [2598, -9613],
                            [2598, -9844],
                            [2096, -9844],
                            [2096, -9744],
                            [2302, -9744]
                        ],
                        "stations": [53, 54, 55, 56, 57]
                    }
                }
            },
            "Landonbahn": {
                "prefix": "",
                "code": "U3",
                "color": "4f52ff",
                "y": 1,
                "branches": {
                    "": {
                        "vertices": [
                            [2453, -9633],
                            [2327, -9633],
                            [2327, -9676],
                            [2324, -9676],
                            [2324, -9858],
                            [2480, -9858]
                        ],
                        "stations": [53, 55, 58]
                    }
                }
            },
            "Jinan Metro": {
                "prefix": "",
                "code": "",
                "color": "",
                "y": 45,
                "branches": {
                    "": {
                        "vertices": [
                            [21435, -7311],
                            [21435, -6975],
                            [21438, -6969],
                            [21438, -6798],
                            [21445, -6792]
                        ]
                    }
                }
            },
            "New Prague Subway": {
                "prefix": "",
                "code": "",
                "color": "6ccca2",
                "y": 49,
                "branches": {
                    "": {
                        "vertices": [
                            [24320, 2178],
                            [24104, 2178],
                            [24104, 2246],
                            [24038, 2246],
                            [24038, 2289],
                            [24029, 2289],
                            [24029, 2567],
                            [23829, 2567],
                            [23770, 2622],
                            [23694, 2622],
                            [23694, 2649],
                            [23420, 2649],
                            [23420, 2498],
                            [23021, 2498],
                            [23021, 2612],
                            [23050, 2612]
                        ],
                        "stations": [74, 75, 76, 77, 78]
                    }
                }
            }
        }
    }
}`)
    // highwayData = await fetchJSON(highwaysURL)
    // if (!highwayData) {
    //     console.log('debug: There was a problem with getting station and line data')
    // }
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

        if (Object.hasOwn(station, 'areas')) {
            const polygons = []
            for (const region of station.areas) {
                polygons.push(
                    // Flipped coordinates because that's how GeoJSON works in contrast to Leaflet :p
                    turf.polygon(
                        [[
                            [region[0][0] / 16, -region[0][1] / 16],
                            [region[0][0] / 16, -region[1][1] / 16],
                            [region[1][0] / 16, -region[1][1] / 16],
                            [region[1][0] / 16, -region[0][1] / 16],
                            [region[0][0] / 16, -region[0][1] / 16],
                        ]]
                    )
                )
            }

            L.geoJson(polygons.length > 1 ? turf.union(turf.featureCollection(polygons)) : polygons[0], {
                style: {
                    color: '#ffffff'
                }
            }).bindPopup(container).addTo(map)
        }

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

    document.getElementById('line-name').textContent = (companyName != '' ? companyName + ': ' : '') + lineName + ' line'
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

                    badge.style.backgroundColor = '#' + highwayData.lines[companyConnection][connectionLine].color

                    badge.addEventListener('click', () => {
                        showLine(companyConnection, connectionLine, highwayData.lines[companyConnection][connectionLine])
                        viewHistory.push(['line', companyConnection, connectionLine, highwayData.lines[companyConnection][connectionLine]])
                    })
                    if (highwayData.lines[companyConnection][connectionLine].code != "") {
                        badge.innerHTML = highwayData.lines[companyConnection][connectionLine].code
                        connection.appendChild(badge)
                    } else if (highwayData.lines[companyConnection][connectionLine].prefix != "") {
                        badge.innerHTML = highwayData.lines[companyConnection][connectionLine].prefix + highwayData.stations[stationId][companyConnection][connectionLine][0]
                        connection.appendChild(badge)
                    } else {
                        badge.innerHTML = connectionLine
                        connection.appendChild(badge)
                    }

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
    document.getElementById('station-notes').innerHTML = `${station.notes}`
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
            lineName.innerHTML = `${line} line ${company != '' ? '(' + company + ')' : ''}`
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
    document.getElementById(tab + '-details').style.display = 'flex'
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