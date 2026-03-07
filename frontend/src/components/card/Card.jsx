import React from 'react';

const Card = () => {
    return (
        <div class="card w-20">
            <img class="card-img-top" src="img_avatar1.png" alt="Card image" />
            <div class="card-body">
                <h4 class="card-title">John Doe</h4>
                <p class="card-text">Some example text.</p>
                <a href="#" class="btn btn-primary">See Profile</a>
            </div>
        </div>
    );
}

export default Card;
