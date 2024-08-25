/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Avatar, ChakraProvider,  Box,  VStack,  Grid,  theme,} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import axios from 'axios';


const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    Authorization: process.env.REACT_APP_ASSEMBLY_API_KEY,
    'content-type': 'application/json',
  },
});

const initialState = {
  url: null,
  blob: null,
  chunks: null,
  duration: {
    h: 0,
    m: 0,
    s: 0,
  }
}
function App() {
  const [audioDetails, setAudioDetails] = useState(initialState);
  const [transcript, setTranscript] = useState({ id: ''});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (transcript.id && transcript.status !== 'completed' && isLoading) {
        try {
          const { data: transcriptData } =await assemblyApi.get(
            `/transcript/${transcript.id}`
          );
          setTranscript({ ...transcript, ...transcriptData });
        } catch (err) {
          console.error(err);          
        }
      } else {
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading, transcript]);
 
const handleAudioStop = (data) => {
  setAudioDetails(data);
};
const handleReset = () => {
  setAudioDetails({ ...initialState });
  setTranscript({ id: '' });
};
const handleAudioUpload = async audioFile => {
  setIsLoading(true);

  const { data: uploadResponse } = await assemblyApi.post(
    '/upload',
    audioFile
  );

    const { data } = await assemblyApi.post('/transcript', {
      audio_url: uploadResponse.upload_url,
      sentiment_analysis: true,
      entity_detection: true,
      iab_catagories: true, 
    });

    setTranscript({ id: data.id });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Avatar
            size="2xl"
            name='Assembly AI'
            src='https://unsplash.com/photos/blue-plastic-robot-toy-R4WCbazrD1g'
            />
            <Box>
              {transcript.text && transcript.status === 'completed' ? (
                <Result transcript={transcript} />
              ) : ( 
                <Status isLoading={isLoading} status={transcript.status} /> 
              )}
            </Box>
            <Box width={1000}>
            <Recorder
            record={true}
            audioURL={audioDetails.url}
            handleAudioStop={handleAudioStop}
            handleAudioUpload={handleAudioUpload}
            handleReset={handleReset}
            />
            </Box>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
