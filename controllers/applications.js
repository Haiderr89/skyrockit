const { application } = require('express');
const User = require('../models/user')

const newApplication = (req, res) => {
    res.render('applications/new.ejs', { title: 'Add a New Application' });
}

const createApplication = async (req, res) => {
    // we can use any of both
    // user id = req.params.userId
    // user id = req.session.user._id
    //---------------
    try {
        const currentUser = await User.findById(req.params.userId)
        currentUser.applications.push(req.body) // pushing the form data into the user model
        await currentUser.save() // save pur edits
        res.redirect(`/users/${currentUser._id}/applications`)

    } catch (error) {
        console.log(error);
        res.redirect('/')
    }

}

const index = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        res.render('applications/index.ejs', {
            title: 'Your Applications',
            applications: currentUser.applications,
        })

    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}

const show = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/show.ejs', {
            title: application.title,
            application: application,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}

const deleteApplication = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        console.log(currentUser);
        currentUser.applications.id(req.params.applicationId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/applications`)

    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}

const edit = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/edit.ejs', {
            title: application.title,
            application,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}


const update = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)

        application.set(req.body)
        await currentUser.save()

        res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`)
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}
module.exports = {
    newApplication,
    createApplication,
    index,
    show,
    deleteApplication,
    edit,
    update,
}