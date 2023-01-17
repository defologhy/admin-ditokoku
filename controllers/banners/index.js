import axios from "axios";

export const bannerUpload= async (request, response)=>{
    // console.log("request body:");console.log(request.body)
    // console.log("request file:");console.log(request.file)
    /*
    1 . Config AXIOS untuk mengakses MicroService Enterprise Structure untuk mendapatkan menambahkan Product Baru
    2 . Execute AXIOS untuk menambahkan Product Baru
    3 . Error Handler
        3.1 Error Handler untuk kegagalan koneksi ke MicroService Enterprise Structure
        3.2 Error Handler untuk pesan gagal dari internal MicroService Enterprise Structure
    4 . Send Response dari Microservice Enterprise Structure
     */
    try{
        let dataResults;
        //1 . Config AXIOS untuk mengakses MicroService Enterprise Structure untuk menambahkan Product Baru
        const axiosConfig={
            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image"
            , method: "POST"
            , timeout: 40000
            , responseType: "json"
            , responseEncoding: "utf8"
            , headers: {"Content-Type": "multipart/form-data"}
            , data: request
        };
        try{
            //2 . Execute AXIOS untuk menambahkan informasi Product
            dataResults = await axios.request(axiosConfig);
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

        return response.status(result.status_code).send(result);

    }catch(error){
        // console.log("error:");console.log(error);
        if(error.hasOwnProperty('error_message')!=null){
            return response.status(error.status_code).send(error);
        }else{
            /*Internal Server Error*/
            const errorJSON ={
                status_code: 500,
                timestamp: '',
                error_title: "Internal Server Error",
                error_message: error.message,
            }
            return response.status(errorJSON.status_code).send(errorJSON);
        }

    }
}
