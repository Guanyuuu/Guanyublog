import { useState,FC } from "react";
import {requestCheckFile, requestMergeUpload, requestUploadFile} from "../../util/requestMethod"
import SparkMD5 from "spark-md5";
import axios from "axios";

const Mfile:FC = () => {
    const [files, setFiles] = useState<any>([])
    const [chunkList, setChunkList] = useState<any>([])

    const handleFileChange = (e:any) => {
        setFiles(e.target.files)
    }

    const handleUploadFile = () => {
        if(files.length === 0) return
        const configFile:any = {
            chunk:1024*1024,
            current:7,
            arrChunks:[],
            file:files[0],
            arrChunksFinished:[],
            arrFaileFiles:[],
            flagSuccess:0
        }
        
        // 进行切片
        function getChunks(singleFile:File) {
            let size = singleFile.size
            let chunks:any[] = []
            let start = 0
            while(start <= size) {
                chunks.push({
                    chunk:singleFile.slice(start, start + configFile.chunk)
                })
                start += configFile.chunk
            }
            configFile.arrChunks = chunks
            setChunkList(chunks)
        }
        // 计算hash
        function caculateHash() {
            const {arrChunks,arrChunksFinished} = configFile
            function dc(index:number) {
                if(index > arrChunks.length - 1) {
                    configFile.arrChunks = arrChunks.filter((value:any) => {
                        return arrChunksFinished.indexOf(value.hash) === -1
                    })
                    
                    uploadCocurrentFile(0, configFile.current)
                    return
                }
                const value = arrChunks[index]
                const spark = new SparkMD5.ArrayBuffer()
                const reader = new FileReader()
                reader.readAsArrayBuffer(new File([value.chunk], configFile.file.name))
                reader.onload = function(e) {
                    spark.append(e.target?.result)
                    
                    arrChunks[index] = {
                        chunk:value.chunk,
                        hash:`${index}-${spark.end()}`
                    }
                    dc(++index)
                }
            }
            dc(0)
        }
        // 上传文件
        async function uploadCocurrentFile(start:number, end:number) {
            const {arrChunks, current, file, arrFaileFiles} = configFile
            
            if(start > arrChunks.length) {
                await requestMergeUpload({
                    name:file.name
                })
                return
            }
            let promiseAll = function corrent() {
                return arrChunks.slice(start, end).map((value:any) => {
                    const data = new FormData()
                    const singleFile = new File([value.chunk], configFile.file.name)
                    let hash = value.hash
                    //上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
                    data.append("hash", hash)
                    data.append("name", configFile.file.name)
                    data.append("file", singleFile)
                    // 挂载取消请求
                    const CancelToken = axios.CancelToken
                    const source = CancelToken.source()
                    value.cancel = source.cancel
                    return requestUploadFile(data,{
                        cancelToken:source.token
                    }).then((value) => {
                        return value
                    }, (err) => {
                        arrFaileFiles.push(value)
                    })
                })
            }
            await Promise.all(promiseAll())
            
            uploadCocurrentFile(end, end + current)
        }
        // 单文件上传
        function uploadSliceFile() {
            // 得到分片
            getChunks(configFile.file)
            // 计算各个分片hash值 以及 上传分片
            caculateHash()
        }
        // 秒传，检查文件是否存在, 断点续传，检已经上传过的分片
        requestCheckFile({filename:configFile.file.name}).then((value:any) => {
            
            if(value.data.des) {
                return
            }else {
                console.log(value);
                
                configFile.arrChunksFinished = value.data.chunks
                uploadSliceFile()
            }
        })        
    }

    const handlePouseUpload = () => {
        if(chunkList.length === 0) {
            return
        }else {
            // 会自动检查是否存在请求存在则进行取消
            chunkList.forEach((value:any) => {
                if(value.hasOwnProperty("cancel")) {
                    value.cancel("暂停上传")
                }
            })
        }
    }

    const handleReupload = () => {
        handleUploadFile()
    }

    return (
        <div>
            <form action="">
                <input type="file" onChange={handleFileChange}/>
            </form>
            <button onClick={handleUploadFile}>上传</button>
            <button onClick={handlePouseUpload}>暂停上传</button>
            <button onClick={handleReupload}>重新上传</button>
        </div>
    )
}


export default Mfile