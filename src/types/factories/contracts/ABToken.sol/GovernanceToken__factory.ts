/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  GovernanceToken,
  GovernanceTokenInterface,
} from "../../../contracts/ABToken.sol/GovernanceToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDelegate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDelegate",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "pos",
        type: "uint32",
      },
    ],
    name: "checkpoints",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "fromBlock",
            type: "uint32",
          },
          {
            internalType: "uint224",
            name: "votes",
            type: "uint224",
          },
        ],
        internalType: "struct ERC20Votes.Checkpoint",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "delegates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getPastTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getPastVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "numCheckpoints",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "s_maxSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101606040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c96101405269d3c21bcecceda10000006009553480156200004557600080fd5b506040518060400160405280600f81526020016e23b7bb32b93730b731b2aa37b5b2b760891b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280600f81526020016e23b7bb32b93730b731b2aa37b5b2b760891b8152506040518060400160405280600281526020016111d560f21b8152508160039080519060200190620000e4929190620007a1565b508051620000fa906004906020840190620007a1565b5050825160209384012082519284019290922060e08390526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810194909452608080850193909352308483018190528151808603909301835260c0948501909152815191909601209052929092526101205250506009546200019d903390620001a3565b620008da565b620001ba8282620001be60201b62000aa11760201c565b5050565b620001d582826200027560201b62000b3e1760201c565b6001600160e01b03620001e9620003648216565b1115620002565760405162461bcd60e51b815260206004820152603060248201527f4552433230566f7465733a20746f74616c20737570706c79207269736b73206f60448201526f766572666c6f77696e6720766f74657360801b60648201526084015b60405180910390fd5b6200026f600862000c296200036a60201b17836200037f565b50505050565b6001600160a01b038216620002cd5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016200024d565b8060026000828254620002e1919062000853565b90915550506001600160a01b038216600090815260208190526040812080548392906200031090849062000853565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3620001ba6000838362000536565b60025490565b600062000378828462000853565b9392505050565b825460009081908015620003d157856200039b6001836200086e565b81548110620003ae57620003ae62000888565b60009182526020909120015464010000000090046001600160e01b0316620003d4565b60005b6001600160e01b03169250620003eb83858760201c565b91506000811180156200042f57504386620004086001846200086e565b815481106200041b576200041b62000888565b60009182526020909120015463ffffffff16145b15620004a3576200044b826200054e60201b62000c351760201c565b86620004596001846200086e565b815481106200046c576200046c62000888565b9060005260206000200160000160046101000a8154816001600160e01b0302191690836001600160e01b0316021790555062000528565b856040518060400160405280620004c543620005bd60201b62000cb81760201c565b63ffffffff168152602001620004e6856200054e60201b62000c351760201c565b6001600160e01b0390811690915282546001810184556000938452602093849020835194909301519091166401000000000263ffffffff909316929092179101555b50935093915050565b505050565b620005318383836200062460201b62000d341760201c565b60006001600160e01b03821115620005b95760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b60648201526084016200024d565b5090565b600063ffffffff821115620005b95760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b60648201526084016200024d565b6200063c8383836200053160201b62000d661760201c565b6001600160a01b0383811660009081526006602052604080822054858416835291205462000531929182169116838183148015906200067b5750600081115b1562000531576001600160a01b0383161562000708576001600160a01b038316600090815260076020908152604082208291620006c5919062000793901b62000d6b17856200037f565b91509150846001600160a01b0316600080516020620026168339815191528383604051620006fd929190918252602082015260400190565b60405180910390a250505b6001600160a01b0382161562000531576001600160a01b0382166000908152600760209081526040822082916200074c91906200036a901b62000c2917856200037f565b91509150836001600160a01b031660008051602062002616833981519152838360405162000784929190918252602082015260400190565b60405180910390a25050505050565b60006200037882846200086e565b828054620007af906200089e565b90600052602060002090601f016020900481019282620007d357600085556200081e565b82601f10620007ee57805160ff19168380011785556200081e565b828001600101855582156200081e579182015b828111156200081e57825182559160200191906001019062000801565b50620005b99291505b80821115620005b9576000815560010162000827565b634e487b7160e01b600052601160045260246000fd5b600082198211156200086957620008696200083d565b500190565b6000828210156200088357620008836200083d565b500390565b634e487b7160e01b600052603260045260246000fd5b600181811c90821680620008b357607f821691505b602082108103620008d457634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c05160e051610100516101205161014051611ce162000935600039600061090d015260006111b401526000611203015260006111de01526000611137015260006111610152600061118b0152611ce16000f3fe608060405234801561001057600080fd5b506004361061018d5760003560e01c80636fcfff45116100e3578063a457c2d71161008c578063d505accf11610066578063d505accf14610362578063dd62ed3e14610375578063f1127ed8146103ae57600080fd5b8063a457c2d714610329578063a9059cbb1461033c578063c3cda5201461034f57600080fd5b80638e539e8c116100bd5780638e539e8c146102fb57806395d89b411461030e5780639ab24eb01461031657600080fd5b80636fcfff451461029757806370a08231146102bf5780637ecebe00146102e857600080fd5b80633644e51511610145578063587cde1e1161011f578063587cde1e146102355780635c19a95c146102795780635d6418471461028e57600080fd5b80633644e51514610207578063395093511461020f5780633a46b1a81461022257600080fd5b806318160ddd1161017657806318160ddd146101d357806323b872dd146101e5578063313ce567146101f857600080fd5b806306fdde0314610192578063095ea7b3146101b0575b600080fd5b61019a6103eb565b6040516101a791906119bc565b60405180910390f35b6101c36101be366004611a2d565b61047d565b60405190151581526020016101a7565b6002545b6040519081526020016101a7565b6101c36101f3366004611a57565b610495565b604051601281526020016101a7565b6101d76104b9565b6101c361021d366004611a2d565b6104c8565b6101d7610230366004611a2d565b610507565b610261610243366004611a93565b6001600160a01b039081166000908152600660205260409020541690565b6040516001600160a01b0390911681526020016101a7565b61028c610287366004611a93565b610586565b005b6101d760095481565b6102aa6102a5366004611a93565b610593565b60405163ffffffff90911681526020016101a7565b6101d76102cd366004611a93565b6001600160a01b031660009081526020819052604090205490565b6101d76102f6366004611a93565b6105bb565b6101d7610309366004611aae565b6105d9565b61019a610635565b6101d7610324366004611a93565b610644565b6101c3610337366004611a2d565b6106cb565b6101c361034a366004611a2d565b610775565b61028c61035d366004611ad8565b610783565b61028c610370366004611b30565b6108b9565b6101d7610383366004611b9a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6103c16103bc366004611bcd565b610a1d565b60408051825163ffffffff1681526020928301516001600160e01b031692810192909252016101a7565b6060600380546103fa90611c0d565b80601f016020809104026020016040519081016040528092919081815260200182805461042690611c0d565b80156104735780601f1061044857610100808354040283529160200191610473565b820191906000526020600020905b81548152906001019060200180831161045657829003601f168201915b5050505050905090565b60003361048b818585610d77565b5060019392505050565b6000336104a3858285610e9b565b6104ae858585610f27565b506001949350505050565b60006104c361112a565b905090565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061048b9082908690610502908790611c57565b610d77565b600043821061055d5760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e65640060448201526064015b60405180910390fd5b6001600160a01b038316600090815260076020526040902061057f9083611251565b9392505050565b610590338261130e565b50565b6001600160a01b0381166000908152600760205260408120546105b590610cb8565b92915050565b6001600160a01b0381166000908152600560205260408120546105b5565b600043821061062a5760405162461bcd60e51b815260206004820152601f60248201527f4552433230566f7465733a20626c6f636b206e6f7420796574206d696e6564006044820152606401610554565b6105b5600883611251565b6060600480546103fa90611c0d565b6001600160a01b03811660009081526007602052604081205480156106b8576001600160a01b0383166000908152600760205260409020610686600183611c6f565b8154811061069657610696611c86565b60009182526020909120015464010000000090046001600160e01b03166106bb565b60005b6001600160e01b03169392505050565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156107685760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610554565b6104ae8286868403610d77565b60003361048b818585610f27565b834211156107d35760405162461bcd60e51b815260206004820152601d60248201527f4552433230566f7465733a207369676e617475726520657870697265640000006044820152606401610554565b604080517fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60208201526001600160a01b03881691810191909152606081018690526080810185905260009061084d906108459060a0016040516020818303038152906040528051906020012061139f565b8585856113ed565b905061085881611415565b86146108a65760405162461bcd60e51b815260206004820152601960248201527f4552433230566f7465733a20696e76616c6964206e6f6e6365000000000000006044820152606401610554565b6108b0818861130e565b50505050505050565b834211156109095760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610554565b60007f00000000000000000000000000000000000000000000000000000000000000008888886109388c611415565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006109938261139f565b905060006109a3828787876113ed565b9050896001600160a01b0316816001600160a01b031614610a065760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610554565b610a118a8a8a610d77565b50505050505050505050565b60408051808201909152600080825260208201526001600160a01b0383166000908152600760205260409020805463ffffffff8416908110610a6157610a61611c86565b60009182526020918290206040805180820190915291015463ffffffff8116825264010000000090046001600160e01b0316918101919091529392505050565b610aab8282610b3e565b6002546001600160e01b031015610b2a5760405162461bcd60e51b815260206004820152603060248201527f4552433230566f7465733a20746f74616c20737570706c79207269736b73206f60448201527f766572666c6f77696e6720766f746573000000000000000000000000000000006064820152608401610554565b610b386008610c298361143d565b50505050565b6001600160a01b038216610b945760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610554565b8060026000828254610ba69190611c57565b90915550506001600160a01b03821660009081526020819052604081208054839290610bd3908490611c57565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3610c25600083836115b6565b5050565b600061057f8284611c57565b60006001600160e01b03821115610cb45760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203260448201527f32342062697473000000000000000000000000000000000000000000000000006064820152608401610554565b5090565b600063ffffffff821115610cb45760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201527f32206269747300000000000000000000000000000000000000000000000000006064820152608401610554565b6001600160a01b03838116600090815260066020526040808220548584168352912054610d66929182169116836115c1565b505050565b600061057f8284611c6f565b6001600160a01b038316610dd95760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610554565b6001600160a01b038216610e3a5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610554565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610b385781811015610f1a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610554565b610b388484848403610d77565b6001600160a01b038316610fa35760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610554565b6001600160a01b0382166110055760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610554565b6001600160a01b038316600090815260208190526040902054818110156110945760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610554565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906110cb908490611c57565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161111791815260200190565b60405180910390a3610b388484846115b6565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561118357507f000000000000000000000000000000000000000000000000000000000000000046145b156111ad57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b8154600090815b818110156112b557600061126c82846116fe565b90508486828154811061128157611281611c86565b60009182526020909120015463ffffffff1611156112a1578092506112af565b6112ac816001611c57565b91505b50611258565b81156112f957846112c7600184611c6f565b815481106112d7576112d7611c86565b60009182526020909120015464010000000090046001600160e01b03166112fc565b60005b6001600160e01b031695945050505050565b6001600160a01b038281166000818152600660208181526040808420805485845282862054949093528787167fffffffffffffffffffffffff00000000000000000000000000000000000000008416811790915590519190951694919391928592917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a4610b388284836115c1565b60006105b56113ac61112a565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b60008060006113fe87878787611719565b9150915061140b81611806565b5095945050505050565b6001600160a01b03811660009081526005602052604090208054600181018255905b50919050565b8254600090819080156114885785611456600183611c6f565b8154811061146657611466611c86565b60009182526020909120015464010000000090046001600160e01b031661148b565b60005b6001600160e01b031692506114a483858763ffffffff16565b91506000811180156114e2575043866114be600184611c6f565b815481106114ce576114ce611c86565b60009182526020909120015463ffffffff16145b15611542576114f082610c35565b866114fc600184611c6f565b8154811061150c5761150c611c86565b9060005260206000200160000160046101000a8154816001600160e01b0302191690836001600160e01b031602179055506115ad565b85604051806040016040528061155743610cb8565b63ffffffff16815260200161156b85610c35565b6001600160e01b0390811690915282546001810184556000938452602093849020835194909301519091166401000000000263ffffffff909316929092179101555b50935093915050565b610d66838383610d34565b816001600160a01b0316836001600160a01b0316141580156115e35750600081115b15610d66576001600160a01b03831615611671576001600160a01b0383166000908152600760205260408120819061161e90610d6b8561143d565b91509150846001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7248383604051611666929190918252602082015260400190565b60405180910390a250505b6001600160a01b03821615610d66576001600160a01b038216600090815260076020526040812081906116a790610c298561143d565b91509150836001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a72483836040516116ef929190918252602082015260400190565b60405180910390a25050505050565b600061170d6002848418611c9c565b61057f90848416611c57565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561175057506000905060036117fd565b8460ff16601b1415801561176857508460ff16601c14155b1561177957506000905060046117fd565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156117cd573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166117f6576000600192509250506117fd565b9150600090505b94509492505050565b600081600481111561181a5761181a611cbe565b036118225750565b600181600481111561183657611836611cbe565b036118835760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610554565b600281600481111561189757611897611cbe565b036118e45760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610554565b60038160048111156118f8576118f8611cbe565b036119505760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610554565b600481600481111561196457611964611cbe565b036105905760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610554565b600060208083528351808285015260005b818110156119e9578581018301518582016040015282016119cd565b818111156119fb576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114611a2857600080fd5b919050565b60008060408385031215611a4057600080fd5b611a4983611a11565b946020939093013593505050565b600080600060608486031215611a6c57600080fd5b611a7584611a11565b9250611a8360208501611a11565b9150604084013590509250925092565b600060208284031215611aa557600080fd5b61057f82611a11565b600060208284031215611ac057600080fd5b5035919050565b803560ff81168114611a2857600080fd5b60008060008060008060c08789031215611af157600080fd5b611afa87611a11565b95506020870135945060408701359350611b1660608801611ac7565b92506080870135915060a087013590509295509295509295565b600080600080600080600060e0888a031215611b4b57600080fd5b611b5488611a11565b9650611b6260208901611a11565b95506040880135945060608801359350611b7e60808901611ac7565b925060a0880135915060c0880135905092959891949750929550565b60008060408385031215611bad57600080fd5b611bb683611a11565b9150611bc460208401611a11565b90509250929050565b60008060408385031215611be057600080fd5b611be983611a11565b9150602083013563ffffffff81168114611c0257600080fd5b809150509250929050565b600181811c90821680611c2157607f821691505b60208210810361143757634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60008219821115611c6a57611c6a611c41565b500190565b600082821015611c8157611c81611c41565b500390565b634e487b7160e01b600052603260045260246000fd5b600082611cb957634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052602160045260246000fdfea164736f6c634300080d000adec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724";

type GovernanceTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovernanceTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovernanceToken__factory extends ContractFactory {
  constructor(...args: GovernanceTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<GovernanceToken> {
    return super.deploy(overrides || {}) as Promise<GovernanceToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GovernanceToken {
    return super.attach(address) as GovernanceToken;
  }
  override connect(signer: Signer): GovernanceToken__factory {
    return super.connect(signer) as GovernanceToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernanceTokenInterface {
    return new utils.Interface(_abi) as GovernanceTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovernanceToken {
    return new Contract(address, _abi, signerOrProvider) as GovernanceToken;
  }
}
