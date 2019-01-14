import React from 'react'
import ContactStore from './ContactStore'
import {ContactList} from './ContactList'

export default ()=>
(
    <ContactStore>
        <ContactList />
    </ContactStore>
);