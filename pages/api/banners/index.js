import { bannerUpload } from "../../../controllers/banners/index";
import axios from "axios";

export const config = {
    api: {
       bodyParser: false,
    },
};

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            // Get Data
            // salesOrderGet(req, res, currentUser.user_id);
            break
        case 'POST':
           
//  const axiosConfig={
//             url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image"
//             , method: "POST"
//             , timeout: 40000
//             , responseType: "json"
//             , responseEncoding: "utf8"
//             , headers: {"Content-Type": "multipart/form-data"}
//             , data: request
//         };
// await axios.request(axiosConfig);

            // const { data } = await axios.post(process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image", req, {
            //     responseType: "stream",
            //     headers: {
            //     "Content-Type": req.headers["content-type"]
            //     },
            // });
            
            let dataResults;
            try{
                //2 . Execute AXIOS untuk menambahkan informasi Product
                dataResults = await axios.post(process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image", req, {
                    responseType: "stream",
                    headers: {
                    "Content-Type": req.headers["content-type"]
                    },
                });
            }catch(error){
                // console.log("error:");console.log(error);
                //3 . Error Handler untuk kegagalan koneksi ke MicroService Enterprise Structure
                let errorContent= {};
                if(error.code === "ECONNREFUSED") {
                    //3.1 Error Handler untuk kegagalan koneksi ke MicroService Enterprise Structure
                    errorContent ={
                        status_code: 500,
                        timestamp: '',
                        error_title: "Internal Server Error",
                        error_message: "The product service on this system is down for maintenance. Please contact your system administrator.",
                    }
                }else{
                    //3.2 Error Handler untuk pesan gagal dari internal MicroService Enterprise Structure
                    if (error.response != null){
                        //Error Message dari Microservice Enterprise Structure
                        errorContent = error.response.data;
                        errorContent.status_code = error.response.status;
                    }
                }
                throw errorContent;
            }
    
            //4 . Send Response berupa informasi Enterprise Structure
            const result = {
                "status_code": 200
            }
    
            res.status(result.status_code).send(result);
            break
        case 'PATCH':
            // Edit
            break
        case 'DELETE':
            // Delete
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}