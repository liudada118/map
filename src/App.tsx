import { Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

export default function App() {
    // ?address=北京市朝阳区阜通东大街6号&output=XML&key=<用户的key>
    const baseLocation = "112.453895,34.619702"
    const baseX = Number(baseLocation.split(',')[0])
    const baseY = Number(baseLocation.split(',')[1])
    const multiple = 200
    const dataLocation = [
        {
            name: '白马寺',
            location: "112.605311,34.721828"
        },
        {
            name: '应天门',
            location: "112.459511,34.677731"
        },
        {
            name: '老君山',
            location: "111.644396,33.753558"

        },
        {
            name: '洛阳博物馆',
            location: "112.451541,34.643323"

        },
        {
            name: '洛阳龙门站',
            location: "112.458781,34.593318"
        }
    ]
    let timeout: any
    const [dataArr, setDataArr] = useState<any>([])
    const [data, setData] = useState<Array<any>>([]);
    const ctx = useRef<any>()
    useEffect(() => {
        // axios.get('https://restapi.amap.com/v3/geocode/geo', {
        //     params: {
        //         address: '北京平乐园小区',
        //         key: '58d771f92047899421f4c47fff42f84c'
        //     }
        // }).then((res) => {
        //     console.log(res.data.geocodes)
        // })
    })
    const fetch = (value: string, callback: (data: { value: string; text: string }[]) => void) => {
        const token = localStorage.getItem('token') || ''
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        const fake = () => {
            axios.get('https://restapi.amap.com/v3/geocode/geo', {
                params: {
                    address: value,
                    key: '58d771f92047899421f4c47fff42f84c'
                }
            }).then((res) => {
                console.log(res.data.geocodes)
                // setData()
                callback(res.data.geocodes)
            })

        };
        if (value) {
            timeout = setTimeout(fake, 300);
        } else {
            callback([]);
        }
    };

    const handleSearch = (newValue: string) => {
        fetch(newValue, setData);
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
        const arr = [...dataArr]
        const value = data.filter(a => a.formatted_address == newValue).length ? data.filter(a => a.formatted_address == newValue)[0] : {}
        arr.push(value)
        setDataArr(arr)
        console.log(arr)

        const ctx = canvasRef.current.getContext('2d')
        arr.forEach((a) => {
            const x = a.location.split(',')[0]
            const y = a.location.split(',')[1]
            ctx.strokeRect((x - baseX) * 50, (y - baseY) * 50, 20, 50);
        })
    };
    const [value, setValue] = useState<string>();


    const canvasRef = useRef<any>()

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.fillStyle = "green";
        // ctx.fillRect(10, 10, 150, 100);
        data.forEach((a) => {
            const x = a.location.split(',')[0]
            const y = a.location.split(',')[1]
            ctx.strokeRect(x - baseX, y - baseY, 20, 50);
        })

        let minX = 0, minY = 0
        dataLocation.forEach((a) => {
            const x = Number(a.location.split(',')[0]) - baseX
            const y = Number(a.location.split(',')[1]) - baseY
            // ctx.strokeRect((x - baseX)*1000, (y - baseY)*1000, 50, 20);
            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
        })

        console.log(minX, minY)

        dataLocation.forEach((a) => {
            const x = Number(a.location.split(',')[0])
            const y = Number(a.location.split(',')[1])
            const realX = (x - baseX - minX) * multiple
            const realY = (y - baseY - minY) * multiple
            console.log((x - baseX - minX) * 1000, (y - baseY - minY) * 1000,)
            ctx.strokeRect((x - baseX - minX) * multiple, (y - baseY - minY) * multiple, 50, 20);
            // const ctx = document.getElementById("canvas").getContext("2d");
            ctx.font = "14px serif";
            ctx.fillText(a.name, realX, realY + 16);
        })
    }, [])

    return (
        <div style={{
            display: 'flex',

        }}>
            <div style={{ flex: 1 }}>
                <Select
                    showSearch
                    value={value}
                    placeholder={'请输入6位SN码'}
                    // style={props.style}
                    style={{ width: '100%' }}
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    notFoundContent={null}
                    options={(data || []).map((d) => ({
                        value: d.formatted_address,
                        label: d.formatted_address,

                    }))}
                />
            </div>
            <div style={{ flex: 3 }}>
                <canvas id="map" ref={canvasRef} width='400px' height='400px'></canvas>
            </div>
        </div>
    )
}
