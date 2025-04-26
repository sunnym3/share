import axios from 'axios';




export function access(params: any) {
    axios.post(
        'http://121.89.212.232:7890/shareInfo/access',
        params,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => {
        console.log(res.data)
        return res.data;
    })
}

export function getShareInfo() {
    axios.get(
        'http://121.89.212.232:7890/shareInfo/stats'
    ).then(res => {
        console.log(res.data)
        return res.data;
    })
}




