export const USER = {
    ERRORS: {
        INVALID_USER_ID: 'Invalid user id',
        USER_NOT_FOUND: 'User does not exist',
        MOBILE_ALREADY_EXISTS: 'Mobile number is already registered',
        CREATE_FAILED: 'Unable to create user',
        FETCH_FAILED: 'Unable to fetch users',
        FETCH_ONE_FAILED: 'Unable to fetch user',
        UPDATE_FAILED: 'Unable to update user details',
        DELETE_FAILED: 'Failed to delete user',
    },
    SUCCESS: {
        USER_CREATED: 'User created successfully',
        USERS_FETCHED: 'Users fetched successfully',
        USER_FETCHED: 'User fetched successfully',
        USER_UPDATED: 'User updated successfully',
        USER_DELETED: 'User marked as deleted',
    }

};

export const NOTIFICATION = {
    ERRORS: {
        INVALID_ID:'Invalid user id or device unique id',
        INVALID_TOKEN:'Invalid FCM Token',
        DEVICE_NOT_FOUND:'Device not found',
        DEVICE_CREATE: 'Failed to save device details',
        DEVICE_FETCHED:'failed to fetch device details'
    },
    SUCCESS: {
        DEVICE_CREATE: 'Device details saved successfully',
        DEVICE_UPDATE:'Device details updated successfully',
        DEVICE_FETCHED:'Device details fetched successfully',
        NOTIFICATION_SEND:'Notification send successfully'
    }
}

export const EMAIL = {
    ERRORS: {
        INVALID_ID:'Invalid Email Id',
    },
    SUCCESS: {
        EMAIL_SEND: 'Email sent successfully'
    }
}