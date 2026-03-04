const mechaData = {
  source: "Robotech - Book 01 - Main (Macross era)",
  mecha: [
    {
      id: "veritech_vf1_series",
      name_es: "Veritech Fighters (VT-1D / VF-1A / VF-1J / VF-1S)",
      category: "veritech",
      era: "Macross",
      description_es: "Cazas transformables (Jet Fighter / Guardian / Battloid) usados por la RDF/U.N. Spacy durante la era Macross.",
      variants_es: [
        "VT-1D (entrenador, biplaza)",
        "VF-1A (estándar)",
        "VF-1J (oficial, 2 mounts láser de cabeza)",
        "VF-1S (líder de escuadrón, 4 mounts láser de cabeza)"
      ],
      "stats": {
        "crew_es": "1 (VF-1A/J/S) o 2 (VT-1D).",
        "weight": "18.5 tons",
        "main_engine": "FF-2001 fusion turbine in each leg.",
        "speed_modes": {
          "jet_fighter": "2676mph (Mach 4) with a 60 mile ceiling",
          "guardian": "670mph/Mach 1 (1078kmph) max; can hover",
          "battloid": "60mph (96.5kmph) max running",
          "space_flight": "120mph"
        },
        "dimensions": {
          "height_battloid": "42.6ft (13m)",
          "height_guardian": "22.3ft (6.79m)",
          "height_jet": "16ft (4.87m)",
          "width_battloid_shoulders": "16ft (4.87m)",
          "wingspan_jet_guardian": "25.3ft (7.7m)"
        }
      },
      "mdc_by_location": {
        "Head Laser Mounts": {
          "value": 24,
          "each": true
        },
        "Head": {
          "value": 75,
          "each": false
        },
        "Arms": {
          "value": 75,
          "each": true
        },
        "Hands": {
          "value": 30,
          "each": true
        },
        "Legs/Engine Thrusters": {
          "value": 150,
          "each": false
        },
        "*Main Body": {
          "value": 250,
          "each": true
        },
        "Reinforced Pilot Compartment": {
          "value": 200,
          "each": false
        },
        "Retractable Utility Arms": {
          "value": 3,
          "each": true
        },
        "Wings": {
          "value": 100,
          "each": true
        },
        "Tail": {
          "value": 50,
          "each": true
        },
        "GU-11 Gun Pod": {
          "value": 100,
          "each": true
        }
      },
      "weapon_systems_text_en": [
        "Weapon Systems",
        "1) Jet Fighter High Powered Lasers: A pair of lasers are built into",
        "the nose of the Veritech Fighter for aerial dog fighters and assault.",
        "They can only be fired when in Jet fighter mode and are limited to a",
        "straight ahead line of fire.",
        "Primary Purpose: Assault",
        "Secondary Purpose: Anti-Missile",
        "Range: 4000ft (1200m)",
        "Mega-Damage: 6D6 M.D. per twin blast. Can only fire short bursts.",
        "Payload: Unlimited",
        "2) Laser(s): Mounted on the head when in Battloid mode, but located",
        "on the underbelly when in Guardian and Jet Fighter mode. 360 degree",
        "rotation. All models have twoattacks per melee or one extended blast.",
        "Width:",
        "Primary Purpose: Assault/Defense Weapon.",
        "Secondary Purpose: Tool for cutting.",
        "Range: 2000ft (609m)",
        "Mega-Damage: WF-1A: 1D4M.D., VF-1J and VT-1D: 2D4 M.D., VF-",
        "1S: 4D4 M.D. One, long, extended blast lasts on full melee and does",
        "double damage; counts as two attacks that melee and can not be used",
        "against fast moving/dodging opponents.",
        "Payload: Unlimited",
        "47",
        "3) Heavy Missiles: These include proton torpedoes, plasma missiles",
        "and reflex missiles. THREE of these large missiles can be mounted",
        "on each wing for a total of six. Torpedoes can be all the same or a",
        "combination. These are always guided missiles of long range capacity.",
        "Primary Purpose: Assault/defense.",
        "Mega-Damage: Varies with individual missile type. See missile descrip-",
        "tions elsewhere.",
        "Payload: 3 on each wing for a total of 6.",
        "Rate of Fire: Any number up to full payload.",
        "4) Light or Medium Short Range Missiles may be substituted for the",
        "long range missiles, but can not be mixed with the long range types.",
        "This means the Veritech Fighter can either carry 6 long range missiles",
        "or 12 short range missile, not both (no medium range missiles).",
        "Warheads vary. See missile descriptions elsewhere for mega-damage,",
        "warheads and range. Rate of Fire: 1, 2, 3, 4, 6, or all.",
        "Total number of missiles: 6 on each wing for a total of 12.",
        "5) GU-11, 55mm, three barrel gun pod. A standard issue armament for",
        "ALL Veritechs!",
        "Primary Purpose: Assault/defense",
        "Mega-Damage: Does 3D6 short burst, 6D6 long burst or 1D6 x 10 dam-",
        "age for full melee burst.",
        "Range: 4000ft (1200m).",
        "Payload: 200 rounds per clip equals 20 short bursts or 10 long bursts or",
        "5 full melee bursts or any combination thereof. Additional ammo clips",
        "can be engaged, but requires 2 a melee, meaning that the player loses",
        "half his attacks that melee.",
        "6) Optional Hand to Hand: Punch does 1D6 mega-damage (M.D.)",
        "in Battloid mode, 1D4 M.D. in Guardian mode, kick does 1D6",
        "M.D. Stomp does 1D4 M.D., but is limited to targets no more than",
        "12 feet tall. Body flip does 1D4 M.D.",
        "WEAPON COMBAT SUMMARY",
        "Attacks Per Melee: Equal to the combined hand to hand skills of the",
        "pilot. Usually 4 attacks at first level.",
        "High Powered Lasers: Available only in Jet Mode; 3D6 M.D., Range:",
        "4000ft (1200m).",
        "Lasers Mounted _on Head:",
        "(609m).",
        "Short or Long Range Missiles: M.D. and Range vary.",
        "GU-11 Gun Pod: 3D6, 6D6 or 106x10 M.D.; Range: 4000ft",
        "(1200m).",
        "Alternate Mode of Attack: Hand to hand punch, kick, stomp or body",
        "block.",
        "Note: The Veritech Fighter in Battloid Mode is more agile than its",
        "human pilot and can execute any hand to hand combat move, such",
        "as jump kick, leap attack, rolls, etc. that the pilot can.",
        "1D4 or 2D4 or 4D4 M.D.; Range: 2000ft"
      ]
    },
    {
      "id": "destroid_excaliber_mk_vi",
      "name_es": "Destroid Excaliber MK VI",
      "category": "destroid",
      "era": "Macross",
      "description_es": "Destroid pesado de asalto/defensa (conocido también como Tomahawk MBR-04-VI en el texto). Armas principales: cañones de haz de partículas en brazos, misiles y clusters de armas.",
      "stats": {
        "vehicle_type": "Destroid",
        "crew": "One or two",
        "main_engine": "MT 828 Fusion Reactor; Output = 2800 SHP",
        "speed": "50mph (88kph)",
        "height": "36.10ft (11.27m)",
        "width": "25.9ft (7.9m) at shoulders",
        "length": "16ft (5.1m)",
        "weight": "31 tons"
      },
      "mdc_by_location": {
        "Searchlight": {
          "value": 20,
          "each": false
        },
        "Upper Arm": {
          "value": 100,
          "each": true
        },
        "P-Beam Forearms": {
          "value": 100,
          "each": true
        },
        "Legs": {
          "value": 200,
          "each": true
        },
        "*Main Body": {
          "value": 300,
          "each": false
        },
        "Reinforced Crew Compartment": {
          "value": 200,
          "each": false
        },
        "Missile Pods Mounted on Shoulders": {
          "value": 150,
          "each": true
        },
        "Missile Pod Above Right Shoulder": {
          "value": 50,
          "each": false
        },
        "Missile Pods on each Leg": {
          "value": 50,
          "each": true
        },
        "Gun Cluster": {
          "value": 75,
          "each": false
        },
        "Top Mounted, Twin Machinegun Unit": {
          "value": 25,
          "each": false
        }
      },
      "weapon_systems_text_en": [
        "Weapon Systems",
        "1) Top mounted, twin barrel, M-89,12.7mm machinegun. Located",
        "recessed between the shoulders and appears almost head-like. The",
        "angle of fire is limited to a 45 degree arc up and down and straight",
        "ahead.",
        "Primary Purpose: Antipersonnel",
        "Mega-Damage: 2D4 M.D. for short burst, 4D4 M.D. for long burst",
        "or 1D4x 10 M.D. for one full melee of continuous fire (each burst is",
        "considered to be one attack regardless of the length).",
        "Payload: 1000 rounds (one short burst uses 10 rounds), long burst 20",
        "and full burst 40. Range: 2000ft (600m)",
        "2) TZ IV Gun Clusters (2): Placed on each side of the chest, just",
        "under the shoulder missile pods. Each of the two gun clusters contain",
        "the following.",
        "Weapons: (1) laser, (1) 32mm auto cannon, (1) 180mm grenade",
        "launcher and (1) flamethrower.",
        "Laser does 2D6 mega-damage (M.D.). Range 2000ft (609.6m). Rate",
        "of fire equal to the pilot's hand to hand attacks per melee. Payload",
        "unlimited.",
        "32mm Auto Cannon does 2D6 M.D. short burst, 4D6 M.D. long burst,",
        "6D6 M.D. for one full melee of continuous fire (each is considered to",
        "be one attack regardless of the size of the burst). Range is 4000ft",
        "(1200m). Payload is limited to 240 rounds. 24 shells are fired per melee",
        "on a full melee burst, 12 in a long burst and 6 in a short burst.",
        "180mm Grenade Launcher does 4D6 M.D.. Range is 4000ft (1310m).",
        "Rate of fire is once per melee. Payload is a total of 50 rounds.",
        "Flamethrower does 5D10 Normal damage (not M.D.; ineffectual against",
        "any mecha). Range is 200ft, rate of fire is two per melee with a total",
        "of 50 blasts. Note: Flames will ignite all combustible mat rial; 40%",
        "chance of igniting gasoline tanks.",
        "3) Missile Launcher Pods mounted on each shoulder. The missile",
        "compartments/launchers are heavily armored, protecting the missiles",
        "from detonation by enemy fire. The missile pods also serve to protect",
        "the shoulder joints.",
        "Primary Purpose: Assault/defense",
        "Secondary Purpose: Riot Control/Civil Rescue",
        "Missile Type: Short range, guided missiles. Specific warheads vary",
        "with the situation and can include explosive, gas and chemical. A",
        "common missile mix for civil defense is 12 explosvie, 4 tear gas, 4",
        "knockout gas, and 4, fire retardent, chemical foam. A common mixfor",
        "straight combat conditions is all explosive, or a combination of 2 plasma/",
        "napalm, 2 smoke, 2 knockout gas and the remainder explosive.",
        "Mega-Damage: Varies with specific warheads. See missile descrip-",
        "tions elsewhere.",
        "Rate of Fire: One at a time or volleys of two with a total of 12 volleys.",
        "Note: Each missile pod holds a pay load of 12 missiles each for a total",
        "of 24 (two fired simultaneously counts as one attack). Volleys can be",
        "fired equal to the total hand to hand abilities of the pilot per melee.",
        "4) Heavy Missile Pods mounted above the right shoulder. The unit",
        "launches a total of six, medium range, medium warhead missiles.",
        "The missiles can be launched one at a time or in volleys of two.",
        "Each volley counts as one attack.",
        "Primary Purpose: Assault/defense",
        "Missile Types: Medium range, guided missiles. Specific warheads",
        "vary.",
        "Mega-Damage: Varies with specific warheads, as does range.",
        "Rate of Fire: Individually or in volleys of two.",
        "Payload: Six missiles total. Manual reload, from somebody outside,",
        "requires the proper equipment and takes 6 melees.",
        "5) Twin, Leg Missile Pods mounted on the leg. Each pod (4) contains",
        "three, small, short range missiles.",
        "Primary Purpose: Defense",
        "Secondary Purpose: Assault",
        "Mega-Damage: Varies with missile type.",
        "Range: Varies with missile type, but are always short range.",
        "Rale of Fire: Indmdoalty or in \\o\\\\eys of two.",
        "Payload: 3 per each pod for a total of 12. Two pods are mounted on",
        "each leg.",
        "6) Particle Beam Cannons, PBC-11, compose each arm. It is these",
        "two, powerful weapons that give the Excaliber MK VI its deadly",
        "long range capabilities.",
        "Primary Purpose: Assault/defense",
        "Mega-Damage: 5D10+ 25 per blast",
        "Range: 10,000ft (nearly two miles)",
        "Payload: Unlimited",
        "Rate of Fire: Four maximum per melee.",
        "7) Optional hand to hand combat is very limited and awkward for",
        "the Excaliber, although its heavy, particle beam cannon arms can",
        "cause a fair amount of damage when used as bludgeons.",
        "Mega-Damage: Punch 1D6 M.D.",
        "Body Block 1D4 M.D.",
        "*Stomp 1D4 M.D.",
        "*The stomp with the foot is effective only against small objects of 12ft",
        "(3.6m) or smaller.",
        "Note: The Excaliber can not jump, leap, kick, or climb. It can not",
        "pickup or carry objects unless they are huge and can be balanced on",
        "the PBC arms. Maximum weight: 8 tons.",
        "Number of Attacks is equal to the hand to hand abilities of the pilot.",
        "Special Equipment: Searchlights mounted above the left shoulder.",
        "Visible light and infrared. Range is 600ft (360m); capable of 180 degree",
        "rotation and an arc of 90 degrees up and down.",
        "THE GLADIATOR",
        "The Gladiator is a non-transformable mecha used as a defensive",
        "weapon system in deep space, aboard the SDF-1, and the by Earth",
        "Defense Force. Unlike its fellow Destroids (like the Excaliber) which",
        "are basically heavy artillery support units, the Gladiator is a frontline",
        "combat unit designed with an excellent balance of mobility, weaponry",
        "and hand to hand combat capabilities. Of all the Destroids, the Gladiator",
        "is the most versatile in overall mobility, agility and means of attack.",
        "It is the only Destroid that can engage in full hand to hand combat. So",
        "powerful are its slashing hands that they have been known to punch",
        "through the armor of Zentraedi assault pods. Its combat capabilities are",
        "augmented with an impressive combination of weapon systems.",
        "The main disadvantage to the Gladiator is that it lacks any sort of",
        "long range weapon system. Another drawback, shared by all ground",
        "mecha, is that it is much slower than most of the enemy mecha it must",
        "face.",
        "Since the Zentraedi assault on Earth, the Gladiator has become a",
        "major tool in the peace-keeping efforts during the difficult reconstruction",
        "of cities and society. It is the ideal unit for law enforcement, riot control,",
        "civil defense, reconnaissance, and patrols in remote areas.",
        "The Gladiator is also known as the Spartan MBR-07-MK II",
        "Vehicle Type: Destroid",
        "Crew: One or two",
        "M.D.C. By Location:",
        "Hands — 100 each",
        "Arms — 150 each",
        "Legs — 250 each",
        "*Main Body — 250",
        "Reinforced Crew Compartment — 250",
        "Missile Pods Mounted on Shoulder — 150 each",
        "Gun Cluster — 75",
        "Top Laser Turret — 25",
        "Battle Mace — 50",
        "GU-11 Gun Pod (optional) — 100",
        "Note: No Head Unit",
        "*Depleting the M.D.C. of the main body shuts the mecha",
        "completely down.",
        "58"
      ]
    },
    {
      "id": "destroid_gladiator",
      "name_es": "Destroid Gladiator",
      "category": "destroid",
      "era": "Macross",
      "description_es": "Destroid de asalto/defensa con fuerte capacidad de combate cuerpo a cuerpo (mace), además de láseres, cañones y misiles.",
      "stats": {
        "vehicle_type": "Destroid",
        "crew": "Two or three, but can hold up to 8 additional passengers.",
        "main_engine": "DT-2004 Fusion Reactor; Output = 3200 SHP series of powerful punches.",
        "speed": "65mph (104kmph) maximum",
        "height": "37ft (11.3m)",
        "width": "27ft (8.3m)",
        "length": "20ft (6.1m)",
        "weight": "27.4 tons"
      },
      "mdc_by_location": {
        "Four Main Cannons": {
          "value": 100,
          "each": true
        },
        "Upper Arms": {
          "value": 100,
          "each": false
        },
        "Forearms/Tri-Cannons": {
          "value": 300,
          "each": false
        },
        "Legs": {
          "value": 300,
          "each": false
        },
        "*Main Body": {
          "value": 400,
          "each": false
        },
        "Reinforced Crew Compartment": {
          "value": 250,
          "each": false
        }
      },
      "weapon_systems_text_en": [
        "Speed: 65mph (104kmph) maximum Number of Attacks Per Melee: Equal to Hand to Hand.",
        "Height: 37ft (11.3m) Special Note: The mace can be thrown. Range: 200ft (61m). Inflicts",
        "Width: 27ft (8.3m) 2D6 M.D.",
        "Length: 20ft (6.1m) 6) Optional Hand to Hand Combat: Rather than fire any weapons,",
        "Weight: 27.4 tons the Gladiator can engage in hand to hand combat by delivering a",
        "Main Engine: DT-2004 Fusion Reactor; Output = 3200 SHP series of powerful punches.",
        "Weapon Systems Mega-Damage: Restrained Punch/Slap — 1D4 M.D.",
        "1) Twin Barrel, ROV-10, Laser Turret: Mounted on top of the Full Strength Punch — 2D6 M.D.",
        "main body between the shoulders like a tiny head. 360 degree rota- Power Punch — 2D6 + 4 M.D.",
        "tion. *Stomp with Foot — 1D4 M.D.",
        "Primary Purpose: Anti-Aircraft Weapon. Body Block/Tackle — 2D4 M.D.",
        "Secondary Purpose: Protection of the Flank Tear or Pry with Hands — 1D4 M.D.",
        "Mega-Damage: 4D6 per blast Note: The Gladiator can not jump, leap or kick. It can climb if the",
        "Range: 4000ft (1200m) structure can support its weight, and can pickup and carry up to 15",
        "2) Missile Launcher Pods: Mounted on each shoulder. The missile tons. Also see Hand to Hand Mecha skill.",
        "compartments/launchers are heavily armored, protecting the missiles *Stomp is effective only against small objects of 12ft or smaller.",
        "from detonation by enemy fire. The missile pods also serve to protect Number of Attacks: Is equal to the hand to hand abilities. Physical",
        "the shoulder joints. hand to hand attacks can be used in combination with weapon attacks.",
        "Primary Purpose: Assault/defense",
        "Secondary Purpose: Riot Control/Civil Rescue",
        "THE M.A.C. II",
        "Missile Type: Short range, guided missiles. Specific warheads vary",
        "with the situation and can include explosive, gas and chemical. A",
        "The M. A.C. II is the largest, non-transformable, ground cruising mecha",
        "common missile mix for civil defense is 12 explosive, 4 tear gas, 4",
        "ever operated by mankind. It was developed, using the mobile systems",
        "knockout gas and 4, fire retardent, chemical foam. A common mix for",
        "of the Destroids, to be a moving fortress. Its design enables it to blast",
        "straight combat conditions is all explosive, or a combination of 2 plasma/",
        "enemy ground troops and repell air assaults as well.",
        "napalm, 2 smoke, 2 knockout gas and the remainder explosive.",
        "The M.A.C. II's destructive force is tremendous, perhaps equalled",
        "Mega-Damage: Varies with specific warheads. See missile descrip-",
        "only by the Spartan and its array of heavy missiles. However, the",
        "tions elsewhere.",
        "practicality of this massive machine in actual combat is questionable.",
        "Rate of Fire: One at a time or volleys of two or four, with a total of 12",
        "It suffers from poor mobility, the lowest speed of all Destroids, lack",
        "volleys. Note: Each missile pod holds upayload of 12 missiles each for",
        "of any short range weaponry, lacks hands for articulated work, and its",
        "a total of 24 (two can be fired simultaneously and count as one attack).",
        "great mass makes it unsuitable for terrains with soft earth, wetlands,",
        "Volleys can be fired equal to the hand to hand abilities of the pilot per melee.",
        "or mountainous regions. Only its incredible armor plating saves it from",
        "3) Main Armament: TZ-IV Gun Cluster located in the heavily",
        "being totally vulnerable to enemy assaults. Consequently, the M.A.C.",
        "armored midsection of the body.",
        "II is often accompanied by the Excaliber and/or Gladiator to help protect",
        "Weapons include: (1) laser, (1) 32mm auto-cannon, (1) 180mm gre-",
        "it from close range onslaughts.",
        "nade launcher and (1) flamethrower.",
        "Since the Zentraedi assault on the Earth, the M.A.C. II has been",
        "Laser does 2D6 mega-damage (M.D.). Range 2000ft (609.6m). Rate",
        "restricted to use as an artillery support system. However, they are also",
        "of fire is equal to the pilot's combined hand to hand attacks. Payload: un-",
        "used to suppress major Zentraedi and rebel uprisings, and for law",
        "limited.",
        "enforcement and defense in remote areas.",
        "32mm Auto Cannon: Does 2D6 M.D. short burst, 4D6 M.D. long",
        "burst, 6D6 M.D. for one full melee of continuous fire (each is considered The M.A.C. II: also known as the Monster; HWR-00-MK II",
        "to be one attack regardless of the size of burst). Range: 4000ft (1310m).",
        "Vehicle Type: Destroid",
        "Payload is limited to 240 rounds. 24 shells are fired per melee on a",
        "Crew: Two or three, but can hold up to 8 additional passengers.",
        "full melee burst, 12 in a long and 6 in a short burst.",
        "M.D.C. By Location:",
        "180mm Grenade Launcher does 4D6 M.D.. Range: 4000ft (1310m).",
        "Four Main Cannons — 100 per each barrel",
        "Rate of Fire: Once per melee. Payload: A total of 50 rounds.",
        "Upper Arms — 100",
        "Flamethrower: Does 5D10 NORMAL damage (not M.D.; ineffectual",
        "Forearms/Tri-Cannons — 300",
        "against any mecha). Range: 200ft. Rate of Fire: Two per melee with",
        "Legs — 300",
        "a total of 50 blasts. Note: Flames will ignite all combustible material;",
        "*Main Body — 400",
        "40% chance of igniting gasoline tanks.",
        "Reinforced Crew Compartment — 250",
        "4) Optional Use of the GU-11 Gun Pod. This is the identical weapon",
        "*Depleting the M.D.C. of the main body will shut the mecha",
        "used by the Veritech Fighters; does 3D6 short burst, 6D6 long burst",
        "completly down.",
        "or lD6 x 10 mega-damage for one full melee burst.",
        "Range: 4000ft (1310m) Speed: 20mph (32.18kph)",
        "Rate of Fire: Number of short bursts and long bursts are equal to the Height: 73.7ft (22.46m)",
        "Width: 31.10ft (9.75m)",
        "pilot's combined number of hand to hand attacks. See Veritech Fighter",
        "for details. Length: 42.7ft (13m)",
        "Weight: 186.3 tons/285.5 tons loaded with missiles and",
        "5) Optional Hand to Hand with a Battle-Mace: This is a large,",
        "full ammo.",
        "12 foot (3.6m), reinforced, metal alloy mace or club. Well balanced;",
        "Main Engine: WT-1001 Fusion Reactor, Output = 11500 SHP",
        "specifically designed for the Gladiator.",
        "Secondary Engine: CT-8P Fusion Reactor, Output = 890 SHP",
        "Primary Purpose: Riot Control/Hand to Hand Combat",
        "Mega-Damage: 1D6 M.D. is added to the normal 2D6 M.D. of a",
        "Gladiator's punch.",
        "60"
      ]
    },
    {
      "id": "destroid_raidar_x",
      "name_es": "Destroid Raidar X",
      "category": "destroid",
      "era": "Macross",
      "description_es": "Destroid antiaéreo rápido y liviano, centrado en armamento láser de largo alcance con sistema de radar avanzado.",
      "stats": {
        "vehicle_type": "Destroid",
        "crew": "One or two",
        "main_engine": "MT 828 Fusion Reactor; Output = 2800 SHP",
        "speed": "80mph (128.72kmph)",
        "height": "35.3ft (10.75m)",
        "width": "24.6ft (7.5m)",
        "length": "16.7ft (5.1m)",
        "weight": "21.7 tons"
      },
      "mdc_by_location": {
        "Radar/Sensor Unit": {
          "value": 50,
          "each": false
        },
        "Searchlights (2)": {
          "value": 15,
          "each": true
        },
        "Upper Arm": {
          "value": 100,
          "each": true
        },
        "Laser Forearms": {
          "value": 75,
          "each": true
        },
        "*Main Body": {
          "value": 250,
          "each": false
        },
        "Reinforced Crew Compartment": {
          "value": 250,
          "each": false
        },
        "Legs": {
          "value": 200,
          "each": true
        }
      },
      "weapon_systems_text_en": [
        "Speed: 80mph (128.72kmph)",
        "Height: 35.3ft (10.75m)",
        "Width: 24.6ft (7.5m)",
        "Length: 16.7ft (5.1m)",
        "Weight: 21.7 tons",
        "Main Engine: MT 828 Fusion Reactor; Output = 2800 SHP",
        "Weapon Systems",
        "1) Pair of wide angle, rapid fire, double barrel Laser Cannons",
        "controlled by an advanced targeting/radar system. This elaborate",
        "targeting/radar system increases the Raidar X's accuracy.",
        "Bonus of + 2 to strike only while the radar sensory unit mounted atop",
        "the mecha is functional. This bonus is in addition to any other bonuses",
        "the pilot might have.",
        "Primary Purpose: Anti-Aircraft",
        "Secondary Purpose: Assault",
        "Mega-Damage: 2D10 short burst, 4D10 heavy burst, 6D10 maximum",
        "burst, per arm.",
        "Range: 8 miles (12.7km)",
        "Rate of Fire: 8 short, 4 heavy, or 4 maximum bursts blasts per melee,",
        "per pair of laser arms (total bursts per melee: 16 short or 8 heavy or",
        "8 maximum bursts). This is the only mecha that has more energy/weapon",
        "attacks than its hand to hand capabilities.",
        "Payload: Unlimited",
        "2) Optional Hand to Hand Combat: Is extremely awkward be-",
        "cause of the lack of hands and normal arms. However, the Raidar",
        "X can get by in a pinch.",
        "Mega-Damage: Punch — 1D4",
        "Body Block — 1D4",
        "*Stomp — 1D4",
        "*The Stomp with the foot is effective only against small objects of 12ft",
        "(3.6m) or smaller.",
        "RAIDAR X Note: The Raidar X can not jump, leap, kick or climb. Nor can it",
        "pick up or carry objects unless they are large and can be balanced or",
        "The Raidar X is a non-trainsformable mecha used as an anti-aircraft cradled by the laser barrel arms. Maximum carrying weight is 6 tons.",
        "unit aboard the SDF-1, by the U.N. SPACY and local Earth govern- Number of Attacks is equal to the hand to hand skills of the pilot.",
        "ments. Raidar X is lighter weight and faster than the other Destroids, 3) Optional: Replace laser arms with dual type, 966-PFG, air-",
        "but relies only on one weapon type — its multi-action, laser armament cooled auto cannons. The auto cannons were used on earlier models,",
        "system. However, the lasers provide multiple, long range attack but replaced by the more formidable lasers.",
        "capabilities unequalled by any other mecha, except for the M. A.C. II. Mega-Damage: 2D10 short volley, 3D10 long volley and 4D10 for a",
        "Despite the Raidar X's superior range it suffers from several disad- maximum volley, per arm.",
        "vantages. It is the lightest and, therefore, least heavily armored, relies Range: 8 miles (12.7km)",
        "on one weapon system, lacks any short range secondary weapons (al- Rate of Fire: 6 short volleys or 4 long or 2 maximum volleys per",
        "though the lasers can be used at close range), and lacks hands; so it each pair of cannons (total of 12, 8 or 4 blasts per melee).",
        "can not grasp, hold or perform any articulated work. Even its enhanced Payload: 200 rounds per arm. (4 rounds are fired at max.)",
        "speed falls short against the speed of the Zentraedi Battle Pods.",
        "SPECIAL EQUIPMENT",
        "Since the Zentraedi invasion, the Raidar X is used primarily for",
        "1) Advanced Radar and Sensory Unit mounted on the top of the",
        "defense in air assaults and as a peace keeping tool, especially in remote",
        "Raidar X mecha's main body housing. Radar Range: 200 miles and",
        "regions and lowlands where its speed and power can be used to full",
        "can track 77 targets simultaneously.",
        "advantage.",
        "Other Sensors . . .",
        "Raidar X: Also known as the Defender ADR-04-MKX Heat: Can pickup and pinpoint heat emanations. Excellent for tracking",
        "Vehicle Type: Destroid and night fighting. Range: 600ft (180m).",
        "Crew: One or two Motion: Detects and registers movement within a 600ft (180m) area.",
        "M.D.C. By Location: Can pinpoint up to 100 targets.",
        "Radar/Sensor Unit — 50 Radiation: Detects and registers levels of radiation, pinpointing areas",
        "Searchlights (2) — 15 each of specific concentration. Range: 2700ft (822.96m).",
        "Upper Arm — 100 each Infrared and Ultraviolet optical/video scan system. Range: 2700ft",
        "Laser Forearms — 75 per each barrel (822.96m).",
        "*Main Body — 250 Combat Computer: Calculates and transmits data onto a control panel",
        "Reinforced Crew Compartment — 250 monitor or head up display on the pilot's helmet.",
        "Legs — 200 each 2) On board computer system to record and analyze data.",
        "Note: No Head Unit 3) Long range laser communications system. Range: 1200 miles;",
        "*Depleting the M.D.C. of the main body shuts the mecha with satellite relay indefinitely.",
        "completely down. 4) Infrared and visible light searchlights. Range: 600ft (180m).",
        "63"
      ]
    },
    {
      "id": "destroid_spartan",
      "name_es": "Destroid Spartan",
      "category": "destroid",
      "era": "Macross",
      "description_es": "Destroid de apoyo de artillería. Básicamente un 'lanzamisiles caminante' con grandes capacidades de rango medio y largo.",
      "stats": {
        "vehicle_type": "Destroid",
        "crew": "Two or Three",
        "ar": 13,
        "main_engine": "MT 828 Fusion Reactor; Output = 2800 SHP",
        "speed": "45mph (72.3kmph)",
        "height": "39.5ft (12.05m)",
        "width": "24.6ft (7.5m)",
        "length": "16ft (5m)",
        "weight": "47.2 tons"
      },
      "mdc_by_location": {
        "Tri-Searchlight": {
          "value": 30,
          "each": false
        },
        "Shoulder Joints": {
          "value": 100,
          "each": false
        },
        "Missile Pods (2)": {
          "value": 150,
          "each": true
        },
        "*Main Body": {
          "value": 200,
          "each": false
        },
        "Reinforced Crew Compartment": {
          "value": 250,
          "each": false
        },
        "Legs": {
          "value": 200,
          "each": true
        }
      },
      "weapon_systems_text_en": [
        "Weapon Systems",
        "RV-B Dune Buggy",
        "1) The Spartan only has one weapon system — missile launchers",
        "mounted on each arm. However, the type of missiles carried can",
        "provide a variety of attacks, damage and range. All the missiles are",
        "self-guided, long or medium range types.",
        "Primary Purpose: Assault and defense",
        "Secondary Purpose: Anti-Aircraft and construction",
        "Mega-Damage: Varies with type of missile(s). See missile descriptions",
        "elsewhere for details on damage and range.",
        "Range: Long and medium range missiles.",
        "Rate of Fire: Can fire volleys of missiles one at a time or in increments",
        "of threes, i.e.: 3, 6, 9, or 11, per arm. One volley, regardless of the",
        "number of missiles fired in that volley, is equal to one hand to hand",
        "attack.",
        "Payload: 22 missiles per each arm for an attack of 44. The missile",
        "pod arms can be reloaded with special vehicles and equipment, but",
        "requires a full 5 minutes or 20 melees.",
        "Note: The missile pods are capable of 360 degree rotation, can move",
        "THE ARMOR/A.R.M.D. SERIES",
        "independently of each other and can fire straight up, if necessary. The",
        "Spartan can fire any of the heavy, long range missiles. Usually a mix",
        "SPACE PLATFORM",
        "or variety of missiles will be carried to accomodate a number of cir-",
        "cumstances. The A.R.M.D. (seen on the T.V. series, in the first episode or two,",
        "2) Optional hand to hand combat is very limited for the Spartan as the Armor 1 and the Armor 2) Space Platform or \"Carrier Space",
        "without true arms and hands, but it is not helpless. Ships\" were originally designed to be a sort of flying dock or space",
        "Mega-Damage: Swatting Blow — 1D4 M.D. rig for space fighter planes and Veritech Fighters. However, the design",
        "Body Block — 1D6 M.D. was modified, adding an array of weapon systems to the platform and",
        "*Stomp — 1D6 M.D. converting it into an aircraft carrier in space. The A.R.M.D. platform",
        "*The Stomp with the foot is effective only against small objects of 12ft quickly became a major component in the Earth Defense Force's",
        "(3.6m) or smaller. strategic system.",
        "66"
      ]
    },
    {
      "id": "destroid_mac_ii_monster",
      "name_es": "Destroid M.A.C. II (Monster)",
      "category": "destroid",
      "era": "Macross",
      "description_es": "Fortaleza móvil. En el PDF la capa de texto disponible trae el detalle de armamento, pero no expone claramente (en texto extraíble) los bloques completos de Speed/Height/M.D.C. por ubicación.",
      "stats": {
        "note_es": "Completar stats/M.D.C. desde el manual (no salió en el texto extraíble del PDF para esta unidad)."
      },
      "weapon_systems_text_en": [
        "THE M.A.C.II (Monster)",
        "Weapon Systems",
        "1) Four, 40cm, Automatic Cannons are its main armament. The",
        "cannons are mounted on top of the mecha's main body.",
        "Primary Purpose: Assault/defense",
        "Secondary Purpose: Anti-Aircraft",
        "Mega-Damage: 2D6 x 10 M.D. per individual round; blast radius:",
        "20ft (6.1m). Can also fire volleys of 2 or 4 rounds simultaneously",
        "(multiply the number of dice rolled appropriately).",
        "Range: 12 miles (19km) minimum effective range 600ft (183m).",
        "Rate of Fire: Is equal to the total hand to hand skills of the pilot",
        "(usually 4 at first level). It must be stressed that one volley, which can",
        "be two or four rounds doing as much as 2400 points of M.D. damage,",
        "is considered to be only one of the total attacks per that melee. See the",
        "volley description under Mecha Combat.",
        "Payload: Each of the FOUR guns can fire TEN rounds each for a",
        "total of 40 rounds. The big guns can be reloaded, but proper equipment",
        "and training is required. To fully reload takes 10 minutes (40 melees)",
        "per each gun.",
        "Note: The four cannons can be raised up and down in a 60 degree",
        "arc. They are not capable of independent movement, which means all",
        "four must be positioned simultaneously.",
        "61",
        "2) Tri-Laser Cannons comprise both arms. These weapons provide",
        "the M.A.C. II with a barrage of long range assaults against enemy",
        "aircraft and ground troops alike.",
        "Primary Purpose: Anti-Aircraft",
        "Secondary Purpose: Assault and defense",
        "Mega-Damage: Fires in volleys of THREE, doing 3D4 x 10 M.D. per",
        "each volley.",
        "Range: 10 miles (16km)",
        "Rate of Fire: Is equal to the total hand to hand skills of the pilot",
        "(usually 4 at first level).",
        "Payload: Unlimited",
        "3) Optional, Triple-Barrel, Anti-Ground Missile Launchers. The",
        "original design of the M.A.C. II had the laser arms fitted with",
        "missile launchers. Advancements in technology enabled scientists",
        "to replace the missile launcher arms with the less limited lasers.",
        "However, the M.A.C. II's modular design allows for it to be fitted",
        "with either type of arms.",
        "Primary Purpose: Assault/Antipersonel",
        "Secondary Purpose: Defense",
        "Mega-Damage: Varies with the specific type of short, medium or long",
        "range missiles fired.",
        "Range: Varies with missile type.",
        "Rate of Fire: Individually, in pairs, or three fired simultaneously (one",
        "attack).",
        "Payload: 12 per each arm for a total of 24. Can be reloaded with",
        "proper equipment, but takes five minutes (20 melees).",
        "4) Optional Hand to Hand Combat: Although limited by its size, WEAPONS COMBAT SUMMARY",
        "weight and design, the M.A.C. II can be as deadly in close combat Attacks Per Melee: Equal to the combined hand to hand skills (mecha",
        "as any of its fellow Destroids. and normal hand to hand) of the pilot.",
        "Mega-Damage: Punch — 2D6 Four, 40cm Auto-Cannon: 2D6x10 M.D.; Range: 12 miles (19km).",
        "* Stomp — 3D4 Tri-Laser Cannons: 3D4 x 10 M.D.; Range: 10 miles",
        "*The M.A.C. II's incredible size makes it able to stomp/step on objects Alternative Modes of Attack",
        "up to 24ft (7.3m) tall. Its weight provides for its significant damage Triple barrel missile launcher: Damage and Range varies with missile",
        "by stomp and punch. type; pay load 24.",
        "Hand to Hand: Punch or Stomp.",
        "62"
      ]
    }
  ]
};

export default mechaData;

// Helper functions for mecha lookups
/**
 * ⚠️ WRAPPER FUNCTIONS - Delegating to MechaRepository
 *
 * Las funciones anteriores buscaban en mechaData.mecha (inline)
 * Ahora delegamos a MechaRepository que carga desde mechas.json
 */

import {
  getMechaById as repoGetMechaById,
  searchMechasByName,
  getMechasByEra as repoGetMechasByEra,
  getMechasByCategory as repoGetMechasByCategory,
} from '../infrastructure/repositories/MechaRepository';

export function getMechaByName(name) {
  // Usar searchMechasByName que hace fuzzy matching
  const results = searchMechasByName(name);
  return results.length > 0 ? results[0] : null;
}

export function getMechaById(id) {
  return repoGetMechaById(id);
}

export function getMechasByEra(era) {
  return repoGetMechasByEra(era);
}

export function getMechasByCategory(category) {
  return repoGetMechasByCategory(category);
}