'use client'

import { useContext, useState } from "react";
import { HomeContext } from "./context/HomeContext";
import { FaPause, FaPlay, FaVolumeOff, FaVolumeUp} from "react-icons/fa";
import videos, { Video } from './data/video';

export default function Home() {
  const [showFilter, setShowFilter] = useState(true);
  const {
    videoURL,
    playing,
    muted,
    volume,
    totalTime,
    currentTime,
    videoRef,
    canvasRef,
    playPause,
    configCurrentTime,
    configVideo,
    configFilter,
    formatTime,
    configMuted,
    configVolume
  } = useContext(HomeContext);

  return (
    <main className="mx-auto w-[80%] mt-2 flex">
      {/* Container para o vídeo e controles */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full mb-2">
          <video className="w-full h-full" ref={videoRef} src={videoURL} hidden={showFilter}></video>
          <canvas className="w-full" ref={canvasRef} hidden={!showFilter}></canvas>
        </div>

        <div className="bg-[#2b0707] w-[70%] flex flex-col items-center">
          <input
            className="
              w-full mb-2
              [&::-webkit-slider-runnable-track]:appearance-none
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-runnable-track]:h-[10px]
              [&::-webkit-slider-thumb]:h-[10px]
              [&::-webkit-slider-thumb]:w-[10px]
              [&::-webkit-slider-thumb]:bg-[#ff6e6e]"
            type="range"
            min="0"
            max={totalTime}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <span className="text-white">
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </span>
          <div className="">
            <button className="text-white mb-2 mr-2 items-center" onClick={playPause}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={()=> configMuted()} className="text-white mb-2 mr-2">
             {
              (muted) ? 
               (<FaVolumeOff />) : 
               (<FaVolumeUp/>)
             }
         </button>
         <div>
                <h1 className="grid place-items-center italic text-white">Volume</h1>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="0.01"
                  value={volume}
                  onChange={(e) => configVolume(Number(e.target.value))}
                />
                </div>
         </div>
          <div className="flex items-center">
            <select onChange={(e) => configFilter(Number(e.target.value))} hidden={!showFilter}>
              <option selected value={0}>Sem filtro</option>
              <option value={1}>Verde</option>
              <option value={2}>Azul</option>
              <option value={3}>Vermelho</option>
              <option value={4}>Preto e branco</option>
              <option value={5}>Invertido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Container das miniaturas, ao lado direito */}
      <div className="w-[150px] h-[50vh] overflow-y-auto ml-4 flex flex-col items-center">
        {videos.map((video: Video, index) => (
          <button key={index} className="w-full mb-1" onClick={() => configVideo(index)}>
            <h2>{video.description}</h2>
            <img className="w-full h-[100px]" src={video.imageURL} alt={`Thumbnail ${index}`} />
          </button>
        ))}
      </div>
    </main>
  );
}
