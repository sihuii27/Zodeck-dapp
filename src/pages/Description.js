import { useState, useEffect } from 'react';

const Descriptions = () => {
    const [description, setDescription] = useState({});

    useEffect(() => {
        const fetchDescriptions = async () => {
            const descArray = {};
            for (let i = 1; i <= 48; i++) {
                try {
                    const response = await fetch(`https://green-manual-badger-37.mypinata.cloud/ipfs/bafybeidlvgplmk5rbamco3ccmz2by4vb5pgia6htesmnybk4comh7yibv4/${i}.json`);
                    const data = await response.json();
                    // Map file index to its description, name and image
                    descArray[i] = {
                        description: data.description,
                        name: data.name,
                        image: data.image
                    };
                } catch (error) {
                    console.error(`Error fetching JSON for card ${i}:`, error);
                }
            }
            // Save descriptions in state
            setDescription(descArray);
        };
        fetchDescriptions();
    }, []);

    return description;
};

export default Descriptions;