import json


with open('states.json') as f:
    states = json.load(f)

states_and_capitals = {}

for state in states:
    states_and_capitals[state['name']] = state['lgas']


with open('states_and_capitals.json', 'w') as f:
    json.dump(states_and_capitals, f, indent=4)
