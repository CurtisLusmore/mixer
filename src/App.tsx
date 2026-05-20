import { useEffect, useRef, useState } from 'react';
import {
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  Paper,
  LinearProgress,
  Slider,
  Stack,
  ThemeProvider,
  Typography,
  type LinearProgressProps,
} from '@mui/material';
import {
  MoreTime,
  PlayArrow,
  Restore,
  Stop,
} from '@mui/icons-material';
import cricket from './assets/cricket.mp3';
import fire from './assets/fire.mp3';
import heartbeat from './assets/heartbeat.mp3';
import lullaby from './assets/lullaby.mp3';
import river from './assets/river.mp3';
import shh from './assets/shh.mp3';
import thunder from './assets/thunder.mp3';
import wave from './assets/wave.mp3';
import whitenoise from './assets/whitenoise.mp3';
import './App.css';

export default function App(): React.ReactElement {
  const [ isPlaying, setIsPlaying ] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container disableGutters>
        <Paper sx={{ p: 4, width: { xs: '100vw', sm: 500 } }}>
          <Stack spacing={2}>
            <SoundSlider icon="💤" src={whitenoise} isPlaying={isPlaying} />
            <SoundSlider icon="👶" src={lullaby} isPlaying={isPlaying} />
            <SoundSlider icon="💓" src={heartbeat} isPlaying={isPlaying} />
            <SoundSlider icon="🤫" src={shh} isPlaying={isPlaying} />
            <SoundSlider icon="⛈️" src={thunder} isPlaying={isPlaying} />
            <SoundSlider icon="🏞️" src={river} isPlaying={isPlaying} />
            <SoundSlider icon="🌊" src={wave} isPlaying={isPlaying} />
            <SoundSlider icon="🔥" src={fire} isPlaying={isPlaying} />
            <SoundSlider icon="🦗" src={cricket} isPlaying={isPlaying} />
            <Controls isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

function SoundSlider({ icon, src, isPlaying }: { icon: string, src: string, isPlaying: boolean }): React.ReactElement {
  const [ volume, setVolume ] = useState(parseInt(localStorage.getItem(`mixer:${icon}`) || '0', 10));
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = volume / 100;
    if (isPlaying && volume > 0) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [ isPlaying, volume ]);

  function handleChange(_: Event, newValue: number | number[]) {
    const volume = newValue as number;
    setVolume(volume);
    localStorage.setItem(`mixer:${icon}`, volume.toString());
  };

  return (
    <Stack direction='row' spacing={4} sx={{ alignItems: 'center', mb: 1 }}>
      <Typography sx={{ fontSize: 32 }}>{icon}</Typography>
      <Slider
        value={volume}
        onChange={handleChange}
        min={0}
        step={50}
        max={100}
        sx={{ flex: 1 }}
      />
      <audio ref={ref} src={src} loop />
    </Stack>
  );
};

function Controls({ isPlaying, setIsPlaying }: { isPlaying: boolean, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>> }): React.ReactElement {
  const [ position, setPosition ] = useState(0);
  const [ duration, setDuration ] = useState(0);

  function play() {
    setIsPlaying(true);
  };

  function stop() {
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  };

  useEffect(() => {
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', stop);
    navigator.mediaSession.setActionHandler('stop', stop);
  }, []);

  useEffect(() => {
    function tick() {
      if (isPlaying && position < duration) {
        setPosition(position => position + 1);
      }
      if (duration > 0 && position === duration) {
        setIsPlaying(false);
      }
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [ isPlaying, duration ]);

  useEffect(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Mixer',
      artist: 'Mixer',
      artwork: [
        { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
      ],
    });
    console.log({ position, duration });
    navigator.mediaSession.setPositionState({
      duration: duration === 0 ? Infinity : duration,
      position,
    });
  }, [ isPlaying, duration ]);

  function handlePlayStop() {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  function handleAddDuration() {
    const step = duration < 60*60 ? 20*60 : 60*60;
    setDuration(duration + step);
  };

  function handleResetDuration() {
    setPosition(0);
    setDuration(0);
  };

  const positionString = position >= 60*60
    ? new Date(position * 1000).toISOString().substring(11, 19)
    : new Date(position * 1000).toISOString().substring(14, 19);

  const durationString = duration >= 60*60
    ? new Date(duration * 1000).toISOString().substring(11, 19)
    : new Date(duration * 1000).toISOString().substring(14, 19);

  const progressProps: LinearProgressProps = duration > 0
    ? {
      value: position,
      min: 0,
      max: duration,
      variant: 'determinate',
    } : isPlaying
    ? {
      variant: 'indeterminate',
    } : {
      value: 0,
      min: 0,
      max: 1,
      variant: 'determinate',
    };
  return (
    <>
    <Stack spacing={1} sx={{ pt: 2 }}>
      <LinearProgress {...progressProps} />
      <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
        <Typography>{positionString}</Typography>
        <Typography>{durationString}</Typography>
      </Stack>
    </Stack>
      <Stack direction='row' spacing={4} sx={{ alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <IconButton size='large' onClick={handleResetDuration}>
          <Restore fontSize='inherit' />
        </IconButton>
        <IconButton size='large' onClick={handlePlayStop} sx={{ backgroundColor: 'text.primary', color: 'background.paper', '&:hover': { backgroundColor: 'text.primary' } }}>
          {isPlaying ? <Stop fontSize='inherit' /> : <PlayArrow fontSize='inherit' />}
        </IconButton>
        <IconButton size='large' onClick={handleAddDuration}>
          <MoreTime fontSize='inherit' />
        </IconButton>
      </Stack>
    </>
  );
};
