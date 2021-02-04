import React, { useState, useEffect, useContext } from "react";
import * as PersonsAPI from '../../components/api/PersonsAPI.js'

import {
    Grid,
    Paper,
    Button
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const EditDossierDialog = (props) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(props.data?.name);
    const [dossier, setDossier] = React.useState(props.data?.position);
    const [comment, setComment] = React.useState(props.data?.description);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = () => {
        PersonsAPI.editPerson({
            id: props.data.id,
            name: name,
            position: dossier,
            description: comment,
            unit: '-'
        }, props.token).then(res => {
            props.updateCallback()
        })
        setOpen(false);
    }

    return (
      <>
        <Button 
            onClick={handleClickOpen}
            variant="contained"
            color="primary"
            size="large">
          Изменить
        </Button>
        <Dialog 
            open={open} 
            onClose={handleClose} 
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            keepMounted
            fullWidth={true}
            maxWidth={'sm'}>
          <DialogTitle id="form-dialog-title">Изменить досье</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="name"
              label="ФИО"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
              />
             <TextField
              autoFocus
              id="dossier"
              label="Тип досье"
              fullWidth
              value={dossier}
              onChange={e => setDossier(e.target.value)}
              />
               <TextField
              autoFocus
              id="comment"
              multiline
              rowsMax={20}
              label="Комментарий"
              fullWidth
              value={comment}
              onChange={e => setComment(e.target.value)}
              />
            <br />
            <br />
            {/* <Button
            variant="contained"
            component="label"
            >
                Добавить фото
                <input
                    type="file"
                    hidden
                />
            </Button> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Отменить
            </Button>
            <Button onClick={handleSave} color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}

export default EditDossierDialog