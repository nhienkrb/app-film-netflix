const db = require('../models');

const create = async (data)=>{
    return await db.Rating.create(data);
}
const remove = async ({user_id, movie_id})=>{
    return await db.Rating.destroy({where:{user_id: user_id, movie_id: movie_id}});
}

const update  = async (data ) =>{
    const { movie_id, stars, comment,user_id } = data;
    return await db.Rating.update(
        { stars:stars, comment:comment },
        { where: { user_id:user_id, movie_id:movie_id } }
    );
}

const getAllByMovieId = async (movie_id)=>{
    return await db.Rating.findAll({where:{movie_id:movie_id}})
}
module.exports = {create, remove, getAllByMovieId, update}
