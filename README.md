# Prisoners CLI

## Overview
Prisoners CLI is a command line application that processes input parameters, specifically designed to accept a parameter named "prisoners". This tool can be used to manage and analyze data related to prisoners.

## Installation

To install the project, clone the repository and navigate to the project directory. Then, run the following command to install the necessary dependencies:

```
npm install
```

## Usage

To use the Prisoners CLI, run the following command in your terminal:

```
node src/index.js [--prisoners <number>] [--strategy <number>] [--factor <number>]
```

## Parameters

prisoners: number of prisoners (default=143)  

strategy (default=1):  
   1: No optimizations  
   2: Stop decrementing count when prisoner's count > prisoners/2  
   3: Delay decrementing. based on count/factor  
   4: Combination of 2 and 3  
   
factor: controls amount of delay, lower numbers delay more (min=1, default=4)

## Example

```
node src/index.js --prisoners 11
```

This command will process the input and execute the logic defined in the application for 10 prisoners.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
