import axios from 'axios';

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
    kind: "ShareInfo"; 
    metadata: Metadata;
}


export function access(params: any) {
    axios
        .post<ShareInfo>("/apis/api.share.plugin.halo.run/v1alpha1/access", {
            mediaName: params.mediaName,
            shareUrl: params.url,
            shareTime: params.accessTime,
            shareLocation: params.accessLocation,
            metadata: {
                generateName: "shareInfo-",
            },
            kind: "ShareInfo",
            apiVersion: "share.plugin.halo.run/v1alpha1",
        })
        .then((response) => {
            console.log(response.data)
        });

}