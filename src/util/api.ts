import axios from 'axios';


export function getShareInfo() {
    axios.get(
        'http://121.89.212.232:7890/shareInfo/stats'
    ).then(res => {
        console.log(res.data)
        return res.data;
    })
}


export function test() {
    // axios.get('/apis/share.plugin.halo.run/v1alpha1/shareInfos').then(res=>{
    //     console.log(res.data)
    // })
    axios.get('http://127.0.0.1:8080/shareInfo/test').then(res => {
        console.log(res.data)
        return res.data;
    })
}
interface Metadata {
    name: string;
    labels?: {
        [key: string]: string;
    } | null;
    annotations?: {
        [key: string]: string;
    } | null;
    version?: number | null;
    creationTimestamp?: string | null;
    deletionTimestamp?: string | null;
}
interface ShareInfo {
    mediaName: String;
    shareUrl: String;
    shareTime: String;
    shareLocation: String;

    apiVersion: "share.plugin.halo.run/v1alpha1"; // apiVersion=自定义模型的 group/version
    kind: "ShareInfo"; // Todo 自定义模型中 @GVK 注解中的 kind
    metadata: Metadata;
}
// interface ShareInfoList {
//     page: number;
//     size: number;
//     total: number;
//     items: Array<ShareInfo>;
//     first: boolean;
//     last: boolean;
//     hasNext: boolean;
//     hasPrevious: boolean;
//     totalPages: number;
// }


export function access(params: any) {
    // console.log("params", params)
    // axios.post(
    //     'http://121.89.212.232:7890/shareInfo/access',
    //     params,
    //     {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }
    // ).then(res => {
    //     console.log(res.data)
    //     return res.data;
    // })
    axios
        .post<ShareInfo>("/apis/console.api.share.plugin.halo.run/v1alpha1/access", {
            mediaName: params.mediaName,
            shareUrl: params.url,
            shareTime: params.accessTime,
            shareLocation: params.accessLocation,
            metadata: {
                // 根据 'todo-' 前缀自动生成 todo 的名称作为唯一标识，可以理解为数据库自动生成主键 id
                generateName: "shareInfo-",
            },
            kind: "ShareInfo",
            apiVersion: "share.plugin.halo.run/v1alpha1",
        })
        .then((response) => {
            console.log(response.data)
        });

}