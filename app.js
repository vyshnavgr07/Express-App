const express = require('express');
const fs = require('fs');
let app = express();
const port = 4001;

app.use(express.json());

let users = JSON.parse(fs.readFileSync('./data/user.json'));

app.get('/api/user', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            users: users,
        },
    });
});

app.get('/api/user/:id', (req, res) => {
    const id = +req.params.id;
    let user = users.find((el) => el.id === id);

    if (!user) {
        res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
        return;
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: user,
        },
    });
});

app.post('/api/user', (req, res) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign({ id: newId }, req.body);
    users.push(newUser);

    fs.writeFile('./data/user.json', JSON.stringify(users), (err) => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        } else {
            res.status(201).json({
                status: 'success',
                data: {
                    user: newUser,
                },
            });
        }
    });
});

app.patch('/api/user/:id', (req, res) => {
    const id = +req.params.id;
    let userUpdate = users.find((el) => el.id === id);

    if (!userUpdate) {
        res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
        return;
    }

    Object.assign(userUpdate, req.body);

    fs.writeFile('./data/user.json', JSON.stringify(users), (err) => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    user: userUpdate,
                },
            });
        }
    });
});

app.delete('/api/user/:id', (req, res) => {
    const id = +req.params.id;
    const userToDelete = users.find((el) => el.id === id);

    if (!userToDelete) {
        res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
        return;
    }

    const index = users.indexOf(userToDelete);
    users.splice(index, 1);

    fs.writeFile('./data/user.json', JSON.stringify(users), (err) => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        } else {
            res.status(204).json({
                status: 'success',
                data: {
                    user: null,
                },
            });
        }
    });
});

app.listen(port, () => console.log("Your server is running"));
