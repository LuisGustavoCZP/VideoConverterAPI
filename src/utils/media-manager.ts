//@ts-nocheck

import {spawn} from "child_process";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

/**
 * 
 * @param {string} cmd 
 * @param {string} tempPath 
 * @returns 
 */
export function MediaManager (cmd="ffmpeg", tempPath="upload")
{
    /**
     * 
     * @param {string} outputPath 
     * @param {string} inputPath 
     * @returns 
     */
    async function convertVideoCoded (inputPath)
    {
        const finalVideoPath = `${tempPath}/${uuid()}.mp4`;

        await new Promise((resolve) =>
        {
            var args = [
                '-y', 
                '-i', inputPath,
                '-codec:a', 'aac',
                '-ac', '1',
                '-c:v', 'h264',
                '-preset', 'fast',
                /* '-preset', 'slow', */
                //'-c:v', 'libx264',
                '-s', '640x480',
                '-profile:v', 'baseline',
                '-level', '3.0',
                
                /* '-movflags', '+faststart', */
                '-f', 'mp4', finalVideoPath
            ];

            const proc = spawn(cmd, args);
            //`${cmd} -i ${file.path} -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p ${outFilePath}`
            
            proc.stdout.on('data', function(data) {
                //console.log(data);
            });

            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function(data) {
                //console.log(data);
            });

            proc.on('close', resolve);
        });

        const file = await fs.readFile(finalVideoPath);
        await fs.rm(finalVideoPath);

        return file;
    }

    /**
     * 
     * @param {string} inputPath 
     * @returns 
     */
    async function getRawInfo (inputPath)
    {
        return await new Promise((resolve) =>
        {
            var args = [
                '-y', 
                '-i', inputPath,
                /* "| grep Duration| sed 's/Duration: \(.*\), start/\x01/g'" */
            ];

            const proc = spawn(cmd, args);
            //`${cmd} -i ${file.path} -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p ${outFilePath}`
            let output = "";

            proc.stdout.on('data', function(data) {
                //console.log("STDOUT", data);
            });

            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function(data) {
                //console.log("STDERR", data);
                output += data;
            });

            proc.on('close', () => 
            {
                resolve(output)
            });
        });
    }

    /**
     * 
     * @param {string} inputPath 
     * @returns 
     */
    async function getMediaLength(inputPath) 
    {
        const [rawMediaInfo] = (await getRawInfo(inputPath)).match(/Duration.*,/gi);
        const [rawTime, rawStartTime] = rawMediaInfo.replace(/Duration:|start:|\s/gi, "").split(",").slice(0, -1);
            
        const startTime = Number(rawStartTime);
        const time = rawTime.split(":").reverse().reduce((p, e, i) => {
            p += Number(e) * (Math.pow(60, i));
            return p;
        }, 0);

        return {startTime, time};
    }

    /**
     * 
     * @param {string} inputPath 
     * @returns 
     */
    async function getInfo (inputPath)
    {
        const rawInfo = await getRawInfo(inputPath);
        const info = [];
        let i = 0, j = 0;

        let infoStrings = rawInfo.split(/Input/gim);
        infoStrings = infoStrings[1].split(/\r\n/gim).slice(1, -2).map((el) => el.trim());
        infoStrings = infoStrings.map((el) => {
            return el.split(/:\s/).map(e => e.split(/,/gi).map(e => e.trim()));
        }).filter((el) => el.length > 1).map(([key, ...values]) => [key, values]);
        
        return Object.fromEntries(infoStrings);
    }

    /**
     * 
     * @param {string} outputPath 
     * @param {string} inputPath 
     * @returns 
     */
    async function createTempMedia (outputPath, inputPath)
    {
        return await new Promise((resolve) =>
        {
            var args = [
                '-y', 
                '-i', inputPath,
                '-c', 'copy',
                /* '-bsf:v', 'h264_mp4toannexb', */
                '-f', 'mpegts', 
                outputPath
            ];

            const proc = spawn(cmd, args);
            
            proc.stdout.on('data', function(data) {
                //console.log(data);
            });

            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function(data) {
                //console.log(data);
            });

            proc.on('close', resolve);
        });
    }

    /**
     * 
     * @param {string} outputPath 
     * @param {string} inputPath 
     * @param {number} times 
     * @returns 
     */
    async function loopVideo (outputPath, inputPath, times)
    {
        const tempListPath = `${tempPath}/${uuid()}.txt`;
        await fs.writeFile(tempListPath, `${`file '${inputPath}'\n`.repeat(times).slice(0, -1)}`);

        await new Promise((resolve) =>
        {
            var args = [
                '-f', 'concat',
                '-safe', '0',
                '-i', tempListPath,
                '-c:v', 'copy',
                outputPath
            ];

            //console.log(args);

            const proc = spawn(cmd, args);

            proc.stdout.on('data', function(data) {
                //console.log("STDOUT", data);
            });

            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function(data) {
                //console.log("STDERR", data);
            });

            proc.on('close', resolve);
        });

        await fs.rm(tempListPath);

        return;
    }

    /**
     * 
     * @param {string} outputPath 
     * @param {string} videoPath 
     * @param {string} audioPath 
     * @returns 
     */
    async function concatMedias (outputPath, videoPath, audioPath)
    {
        /* const tempListPath = `${tempPath}/${uuid()}.txt`;
        await new Promise((resolve) => {
            fs.writeFile(tempListPath, `${`file '${inputPath}'\n`.repeat(times).slice(0, -1)}`, resolve);
        }); */

        await new Promise((resolve) =>
        {
            //ffmpeg -i "video.mp4" -i "music.m4a" -c:v copy -map 0:v:0 -map 1:a:0 -shortest "out.mp4"
            var args = [
                '-i', videoPath,
                '-i', audioPath,
                '-c:v', 'copy',
                '-map', '0:v:0',
                '-map', '1:a:0',
                '-shortest',
                outputPath
            ];

            const proc = spawn(cmd, args);

            proc.stdout.on('data', function(data) {
                //console.log("STDOUT", data);
            });

            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function(data) {
                //console.log("STDERR", data);
            });

            proc.on('close', resolve);
        });

        return;
    }

    /**
     * 
     * @param {Express.Multer.File} video 
     * @param {Express.Multer.File} audio 
     * @returns 
     */
    async function mergeMedias(video, audio)
    {
        const videoInfo = await getMediaLength(video.path);
        const audioInfo = await getMediaLength(audio.path);
        
        const repeatVideo = audioInfo.time / videoInfo.time;

        const loopVideoPath = `${tempPath}/${uuid()}.mp4`;
        await loopVideo(loopVideoPath, video.filename, Math.ceil(repeatVideo));
        
        const finalVideoPath = `${tempPath}/${uuid()}.mp4`;
        await concatMedias(finalVideoPath, loopVideoPath, audio.path);

        await fs.rm(loopVideoPath);

        const file = await fs.readFile(finalVideoPath);
        await fs.rm(finalVideoPath);

        return file;
    }

    return {
        cmd,
        tempPath,
        convertVideoCoded,
        getRawInfo,
        getMediaLength,
        //getInfo,
        //createTempMedia,
        loopVideo,
        concatMedias,
        mergeMedias,
    }
}

export default MediaManager("C:/ffmpeg/bin/ffmpeg.exe");