import { Box, Text, Tooltip } from '@chakra-ui/react';

const sentimentColor = {
    POSITIVE: 'lightgreen',
    NEGATIVE: 'pink',
    NEUTRAL: 'lightgray',
};

export default function Highlighted({ text, sentiment, entities }) {
    //text = "Ted Conference was great!"
    //entities = [ { text: 'Ted Conference', entity_type: 'event }]

    const entityText = entities.map((e) => e.text);
    const parts = text.split(new RegExp(`(${entityText.join('|')})`, 'g'));

    return (
    <Box as="mark" bg={sentimentColor[sentiment]} mr="1">
        {parts.map(part => {
            const matchingEntity = entities.find(e => e.text === part);

        if (matchingEntity) {
            return ( 
                <Tooltip label={matchingEntity.entity_type} key={part}> 
                    <Text display="inline" fontSize="xl" fondWeight="bold">
                        {part}
                    </Text>
                    </Tooltip>
                );
            }

            return part;
        })}
    </Box>
    );
}