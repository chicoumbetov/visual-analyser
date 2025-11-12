interface ExifNumber {
    numerator: number;
    denominator: number;
}

// * core structure of the EXIF tags can be seen in the console
interface IExifData {
    ImageDescription: string;
    Make: string;
    Model: string;
    Orientation: number;
    XResolution: ExifNumber | number; // XResolution can be a number or an ExifNumber object
    YResolution: ExifNumber | number;
    DateTimeOriginal: string;
    GPSLatitude: (ExifNumber | number)[]; // Array of degrees, minutes, seconds
    GPSLongitude: (ExifNumber | number)[];
    GPSLatitudeRef: 'N' | 'S';
    GPSLongitudeRef: 'E' | 'W';
}

/**
 * Represents a standard File object decorated with EXIF and IPTC data 
 * after processing by the exif-js library.
 */
interface IExifFile extends File {
    exifdata: IExifData;
    iptcdata: Record<string, any>;
}
