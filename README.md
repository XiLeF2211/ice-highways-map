# EarthMC Ice Highways Map

This is a tool that aims to give information on stations and lines across the EarthMC server. However, right now, 
it only has 116 lines and 724 stations (including junctions and interchanges and elevators). You can contribute station and line information by posting an issue with the tag 'newlocation.'

## Bulletin board

xilef, the founder of the Ice Highway Map, will be rarely active because he is extremely occupied with his school, so please send your requests to nokteholda or Chitonator via [TNIH discord](https://discord.gg/SK8r4Ce25U) or pull requests. Thank you.

***PLEASE READ IF YOU ARE ADDING STATIONS AND LINES***

This is a clarification for defining connections between lines and between branches because some of these connections are defined wrong and I am going through to fix them.

For each line, there are branches as such:
```
"Example line": {
  ...
  "branches": {
    "First branch": {
      "vertices": [[x, z], [x, z]],
      "stations": [0, 1, 2, 3, 4]
    },
    "Second branch": {
      "vertices": [[x, z], [x, z]],
      "stations": [5, 6, 7, 8]
    }
  }
}
```
For each station, there are lines that the station is on and the specific branch it is on as well. The branch **MUST BE THE SAME NAME** as described in the line data. For example, the station with the ID 0 is on the First branch of Example line:
```
"Example station": {
  ...
  "id": 0,
  "lines": {
    "Example company": {
      "Example line": ["", "First branch"]
    }
  }
}
```
These are **CASE-SENSITIVE**. That means that if the branch name is "Main line", then the station must refer to it as "Main line", and **NOT** "Main Line" with a capital L.

Additionally, if the station connects multiple **BRANCHES WITHIN THE SAME LINE**, then the stations array of each branch must have corresponding branch references. For example, if the station 1 connects First branch and Second branch, then in the data for First branch, the stations array would look like:

`"stations": [0, [1, "Second branch"], 2, 3, 4]`

Therefore, in Second branch, there must also be an array corresponding to this one:

`"stations": [5, 6, 7, [1, "First branch"], 8]`

These arrays are **NOT** to be used to describe a line connection to another line...only from one branch to another branch within the **SAME LINE**. There is no need to specify which other lines a station may connect to; only the branches it connects to are needed.

Similarly, in the station data, use the keyword "to" to specify a connection of one branch to another branch, but **NEVER** from a line to another line. For station 1, that would looke like:
```
"lines": {
  "Example company": {
    "Example line": ["", "First branch to Second branch"]
  }
}
```
Note that the capitalization does not change, and note that it is simply the string `"First branch to Second branch"`, not an array `["First branch", "Second branch"]`.

## Logs

8 September 2025: Kano and Abuja Ice lines (Afrique Rail). (Thanks to **ObsidianGuy** for report)

5 September 2025: Xotic-Xports tram lines and Ice lines near Bamboo (edited by **Chitonator**)

4 September 2025: Metro Karakas Line and Eko Ice Highway (Porto Novo-Sienna and Hustopia-Greenfield section) (edited by **nokteholda**)

28 August 2025: Japan Underground Ice Road Namboku Line (edited by **nokteholda**)

27 August 2025: Norania-Fort Uligan Line (edited by **nokteholda**)

8 August 2025: TNIH Chittagong Bypass and Avachi Rapid Lines (edited by **nokteholda**)

31 July — 12 August 2025: Added Y=53 Ice lines system (full), Y=93 Ice lines, Y=21 Ice lines, Russian Republic ice lines system, Y=42 Ice lines system and some minor fixes (Thanks to nokteholda, XiLeF2211)

30 July 2025: Y=53 Ice lines system (around Chitograd) (data from **Chitonator** on Discord)

28 July 2025: Ariguma Railway (AR) Nankyouku Shinkansen and Karafuto Ice Highway (edited by **nokteholda**)

26 July 2025: Kushan Metro, Chitograd Ice Highways lines (data from **Chitonator** on Discord), and Suma-Sula Ice Road (edited by **nokteholda**)

25 July 2025: TNIH Loopstan Line (edited by **nokteholda**)

24 July 2025: TNIH Ladakh, Pakistan, Afghan and Tajik lines, and Oates-Oil Subway (edited by **nokteholda**)

9 July 2025: TNIH Haldwan-Castlers and (completion of) TNIH Bangla-Caspian lines (data from **nokteholda**)

6 July 2025: Havaiki and Tasman lines connecting to Australia (data from **AtomicTom** on Discord)

3 July 2025: Four South Pole lines (data and JSON from **UpgradeWasTaken**) and North Canada-Greenland Subterranean Highway

30 Jun 2025: Laccadive Sea line (no stations), MTA lines (Red, Blue, Green, Purple, White), Pilbaran National Highway lines

17 Jun 2025: SEAN Light blue line

16 Jun 2025: SEAN Green line

15 Jun 2025: New Prague Subway line

9 Jun 2025: Partial TNIH Bangla-Caspian line (data from **nokteholda**)

8 Jun 2025: German Ringbahn and Landonbahn lines

6 Jun 2025: Singapore City Metro (data from **nokteholda**)

4 Jun 2025: TNIH Nyingchi and Everest lines (data from **nokteholda**)

2 Jun 2025: TNIH Gujarat and Meteorville lines (data from **nokteholda**)

1 Jun 2025: TNIH (Intercontinental) Lower Himalayas line

30 May 2025: SEAN (Pilbara) Purple line
