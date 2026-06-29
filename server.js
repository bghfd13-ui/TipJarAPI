const express = require("express");
const axios = require("axios");


const app = express();

const PORT = process.env.PORT || 3000;



app.get("/", (req,res)=>{
	res.send("TipJar API online");
});



app.get("/passes/:userId", async (req,res)=>{

	const userId = req.params.userId;

	console.log("Ищем пассы:", userId);


	try {


		const response = await axios.get(
			`https://www.pekora.zip/api/catalog/items?category=0&limit=100&sortType=0&creatorTargetId=${userId}`
		);



		let passes = [];


		for(const item of response.data.data || []){


			if(item.assetType == 34){


				passes.push({

					id: item.id,
					name: item.name,
					price: item.price

				});


			}


		}



		console.log("Найдено:", passes);


		res.json(passes);



	} catch(err){


		console.log(err.response?.data || err.message);

		res.json([]);


	}


});



app.listen(PORT, ()=>{

	console.log("TipJar API online");

});
