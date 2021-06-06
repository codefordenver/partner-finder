import React, { useState } from 'react';

export function loadToken() {
    return `Bearer ${window.localStorage.getItem('token')}`
}