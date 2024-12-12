import json

output_directory = "./json_files/"
animals = ["Dog", "Dragon", "Horse", "Monkey", "Ox", "Pig", "Rabbit", "Rat", "Rooster", "Sheep", "Snake", "Tiger"]
elements = ["Fire", "Forest", "Ice", "Poison"]

# Descriptions based on elements and animals
element_descriptions = {
    "Fire": "fiery spirit that blazes with determination and power",
    "Forest": "nature's guardian, flourishing with vitality and growth",
    "Ice": "chilled resilience and calm, yet unyielding in strength",
    "Poison": "mysterious force, combining cunning and stealth with lethal precision"
}

animal_descriptions = {
    "Dog": "a loyal companion with unwavering bravery",
    "Dragon": "a mythical creature radiating wisdom and strength",
    "Horse": "a free spirit that races with unbridled passion",
    "Monkey": "a playful trickster with cleverness and agility",
    "Ox": "a determined soul with unmatched endurance and power",
    "Pig": "a symbol of prosperity and steadfast generosity",
    "Rabbit": "a quick and clever thinker, always a step ahead",
    "Rat": "a resourceful survivor with unmatched adaptability",
    "Rooster": "a bold leader who heralds new beginnings",
    "Sheep": "a gentle heart filled with creativity and warmth",
    "Snake": "a cunning strategist with a mysterious aura",
    "Tiger": "a fierce warrior driven by courage and strength"
}

for i in range(1, 49):
    # Assign the element based on the card index
    if 1 <= i <= 12:
        element = elements[0]
    elif 13 <= i <= 24:
        element = elements[1]
    elif 25 <= i <= 36:
        element = elements[2]
    else:
        element = elements[3]  

    # Determine the animal based on the index
    animal = animals[(i - 1) % len(animals)]

    # Create a unique description combining element and animal traits
    description = f"The {element_descriptions[element]} combines with {animal_descriptions[animal]} to create a truly unique presence."

    # Data structure for JSON
    data = {
        "attributes": [
            {
                "trait_type": "Animal",
                "value": animal
            },
            {
                "trait_type": "Element",
                "value": element
            }
        ],
        "description": description,
        "image": f"https://green-manual-badger-37.mypinata.cloud/ipfs/bafybeifd5ackizs5fyc6pe7cghazwkqf7docpk6tetuq5dfkvrrnate3be/{i}.png",
        "name": f"{animal} - {element}"
    }

    # Save the JSON to a file
    filename = f"{i}.json"

    with open(output_directory + filename, "w+") as json_file:
        json.dump(data, json_file, indent=4)
