import { AdvancedImage } from '@cloudinary/react';
import { thumbnail } from '@cloudinary/transformation-builder-sdk/actions/resize';
import { FocusOn } from '@cloudinary/transformation-builder-sdk/qualifiers/focusOn';
import { focusOn } from '@cloudinary/transformation-builder-sdk/qualifiers/gravity';
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions.
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";

type Props = { cld: Cloudinary, publicId: string, width?: number, height?: number, radius?: number };

const TransformImage = ({ cld, publicId, width, height, radius }: Props) => {

    // Use the image with public ID
    const myImage = cld.image(publicId);

    // Apply the transformations.

    let cropper = null;

    if (width || height) {
        cropper = thumbnail()

        if (width) {
            cropper = cropper.width(width);
        }
    
        if (height) {
            cropper = cropper.height(height);
        }

        // Crop the image.
        myImage.resize(
            cropper.gravity(focusOn(FocusOn.face()))
        )
    }

    if (radius) {
        // Round the corners.
        myImage.roundCorners(byRadius(radius));
    }

    myImage.format('png');   // Deliver as PNG. */

    // Render the transformed image in a React component.
    return (
        <AdvancedImage cldImg={myImage} />
    )
};

export default TransformImage;