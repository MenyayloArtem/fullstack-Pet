export default function (type : string) {
    return (payload? : any) => ({
        type,
        payload : payload || undefined
    })
}