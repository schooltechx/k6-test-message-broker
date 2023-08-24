import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function insertM({userId,createdAt,content}){
    //await sleep(1000)
    const stamp = await prisma.m.create({data:{userId,createdAt,content}})
    console.log( "M:"+stamp.id+":"+stamp.createdAt.toLocaleString('th-TH', {timeZone: 'Asia/Bangkok',})+":"+stamp.content )
}
export async function insertR({userId,createdAt,content}){
    //await sleep(1000)
    const stamp = await prisma.r.create({data:{userId,createdAt,content}})
    console.log( "R:"+stamp.id+":"+stamp.createdAt.toLocaleString('th-TH', {timeZone: 'Asia/Bangkok',})+":"+stamp.content )
}
export async function insertD({userId,createdAt,content}){
    //await sleep(1000)
    const stamp = await prisma.d.create({data:{userId,createdAt,content}})
    console.log( "D:"+stamp.id+":"+stamp.createdAt.toLocaleString('th-TH', {timeZone: 'Asia/Bangkok',})+":"+stamp.content )
}

export async function clearDB(){
    const m = await prisma.m.deleteMany({}) 
    const r = await prisma.r.deleteMany({})
    const d = await prisma.d.deleteMany({})
    const rows = m.count + r.count + d.count
    console.log(`clear ${rows} rows`)
    return rows
}
export function genObj(id,content){
    return {id,createdAt:new Date,content}
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}