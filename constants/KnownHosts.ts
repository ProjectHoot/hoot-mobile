export interface KnownHost {
  name: string;
  domain: string;
}

export const KnownHosts: KnownHost[] = [
  {
    name: "Narwhal.City",
    domain: "narwhal.city",
  },
  {
    name: "FBXL",
    domain: "lotide.fbxl.net",
  },
  { 
    name: "nfld",
    domain: "https://lotide.nfld.uk/",
  },
  {
    name: "Tide C",
    domain: "c.tide.tk",
  },
  {
    name: "Exopla",
    domain: "lotide.exopla.net.eu.org",
  },
  {
    name: "Narwhal.City (Dev)",
    domain: "dev.narwhal.city",
  },
  {
    name: "Tide B",
    domain: "b.tide.tk",
  },
  {
    name: "Tide A",
    domain: "a.tide.tk",
  },
];

export default KnownHosts;
