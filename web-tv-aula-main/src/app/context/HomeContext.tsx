'use client'

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

type HomeContextData = {
    videoURL: string;
    playing: boolean;
    volume: number;
    totalTime: number;
    currentTime: number;
    muted: boolean;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    formatTime: (seconds: number) => string;
    configMuted: () => void;
    playPause: () => void;
    configVolume: (value: number) => void;
    configCurrentTime: (time: number) => void;
    configVideo: (index: number) => void;
    configFilter: (index: number) => void;
};

export const HomeContext = createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;
};

const HomeContextProvider = ({ children }: ProviderProps) => {
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        configVideo(videoIndex);
    }, []);

    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        setVideoURL(currentVideo.videoURL);
        setVideoIndex(currentIndex);

        // Iniciar o contexto de áudio apenas uma vez
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
            const gainNode = audioContextRef.current.createGain();
            gainNodeRef.current = gainNode;
        }
    };

    const configFilter = (index: number) => {
        setFilterIndex(index);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.onloadedmetadata = () => {
                setTotalTime(video.duration);
                setCurrentTime(video.currentTime);
                if (playing) video.play();
    
                // Verifica se já existe um audioContext e gainNode criados e os conecta ao novo vídeo
                if (audioContextRef.current && gainNodeRef.current) {
                    // Desconecta o nó de ganho anterior e cria uma nova fonte de áudio para o novo vídeo
                    const source = audioContextRef.current.createMediaElementSource(video);
                    source.connect(gainNodeRef.current).connect(audioContextRef.current.destination);
                } else if (!audioContextRef.current) {
                    // Cria o contexto de áudio e o nó de ganho, se ainda não foram criados
                    audioContextRef.current = new AudioContext();
                    const gainNode = audioContextRef.current.createGain();
                    const source = audioContextRef.current.createMediaElementSource(video);
                    source.connect(gainNode).connect(audioContextRef.current.destination);
                    gainNodeRef.current = gainNode;
                }
            };
    
            video.ontimeupdate = () => setCurrentTime(video.currentTime);
            video.onended = () => configVideo(videoIndex + 1);
        }
        draw();
    }, [videoURL, filterIndex, playing]);

    

    const configVolume = (value: number) => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = value;
        } else {
            const video = videoRef.current;
            if (video) video.volume = value;
        }
        setVolume(value);
    };

    const configMuted = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
    };

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const playPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.pause();
        } else {
            // Iniciar o contexto de áudio se estiver suspenso
            if (audioContextRef.current && audioContextRef.current.state === "suspended") {
                audioContextRef.current.resume();
            }
            video.play();
            draw();
        }
        setPlaying(!playing);
    };

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const invert = data[i + 3];

            filter.calc(red, green, blue, invert);
            data[i] = filter.red;
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
            data[i + 3] = filter.invert;
        }

        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(draw);
    };

    return (
        <HomeContext.Provider
            value={{
                videoURL,
                playing,
                totalTime,
                currentTime,
                volume,
                videoRef,
                canvasRef,
                playPause,
                configCurrentTime,
                configVideo,
                configFilter,
                formatTime,
                configMuted,
                muted,
                configVolume,
            }}
        >
            {children}
        </HomeContext.Provider>
    );
};

export default HomeContextProvider;
