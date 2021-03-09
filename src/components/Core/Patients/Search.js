import React, { useState, useEffect } from "react";
import { InputGroup, FormControl , Button } from "react-bootstrap";

const Search = (props) => {

    const [searchIsrl_ID, SetSearchIsrl_ID] = useState("");
  
      useEffect(() => {
        props.FSetSearchIsrl_ID(searchIsrl_ID);
      }, [props, searchIsrl_ID]);
      
    const handleChange = (event) => {
      SetSearchIsrl_ID(event.target.value);
    };

    const resetSearchField = (event) => {
      SetSearchIsrl_ID("");
    };
    
    return (
      <InputGroup id='search'>
        <FormControl
          style={{ direction: 'rtl' }}
          placeholder='8 ספרות'
          value={searchIsrl_ID}
          onChange={handleChange}
        />
        <Button variant='link' style={{ position: 'absolute', zIndex: '99' }} onClick={resetSearchField}>
          x
        </Button>
        <InputGroup.Prepend>
          <InputGroup.Text style={{ direction: 'rtl' }} className='text-right'>
            מספר מקרה/קבלה
          </InputGroup.Text>
        </InputGroup.Prepend>
      </InputGroup>
    );
}

export default Search;