Eternal Anvil
===
Website toolkit for Arkheim.


# Primary functionalities

## (Minor) Distance calculator
Have a simple distance calculator (that can actually just be brought up as a modal) to calculate the time it takes to travel. It should allow input for source, destination and WL speed. It should also have a selectable option for the distance penalties:
```
Added distance per mission type:
Goblin fort, relic = 0
Goblin tower raid and anvil attack = 5
Support mission to towers = 10
Raiding towers = 16
Conquers / Destroy (portal) = 20
```

## Battle planner
Have a battle planner with the ability to create a "strategy map" with points of interest and the ability to see the distance between them. Additionally, the map can be adjusted to a "real map" with the use of a screenshot and two points, and the "website objects" will align with everything - for better visualization.

## Matchup planner
Have a simple drag-and-drop style matchup planner to plan which warlords will / should face which. The warlords can be added manually (Warlord, Total FS, and troop in each troop slots (maybe FS per troop slot?)) or they can be added trough a pasted screenshot where the user selects the area. The tool itself will not block any FS restrictions (it'll allow the player to put a less FS WL ahead of another one).

## (Future) Combat simulator
The ability to simulate combat odds (given that there's some RNG regarding items).

## (Future) Share-able links
Be able to do joint battle planning trough a share-able link that will allow viewing in real time - permissions can be given for "spectator" and "planner".


# Implementation notes

## dnd-kit version
Currently this project is actually using a fork of dnd-kit: [alissaVrk's fork](https://github.com/alissaVrk/dnd-kit). This is due to [PR #1096](https://github.com/clauderic/dnd-kit/pull/1096) that covers the issue that dragging something re-renders all items in said context, instead of just the item being dragged. Given that dnd-kit is currently undergoing a major rework (see [#1194](https://github.com/clauderic/dnd-kit/issues/1194)) it's unlikely this PR will be merged any time soon; however, when the rework is done, this issue should be fixed.

Unfortunately, the fork is not really correctly configured in NPM to be used with Vite (wrong module field in their package.json). We can fix this by running the `fix-dnd-kit-fork` script after installing dependencies.
