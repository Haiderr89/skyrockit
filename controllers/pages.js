const home = async (req, res) => {
    res.render("index.ejs", {title: 'Skyrockit'});
}

module.exports = {
    home,
}