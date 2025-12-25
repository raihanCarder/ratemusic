import type { Album } from "@/types/album";
const sampleData: Album[] = [
  {
    id: "blonde",
    title: "Blonde",
    artist: "Frank Ocean",
    image: "https://picsum.photos/seed/blonde/300/300",
  },
  {
    id: "damn",
    title: "DAMN.",
    artist: "Kendrick Lamar",
    image: "https://picsum.photos/seed/damn/300/300",
  },
  {
    id: "after-hours",
    title: "After Hours",
    artist: "The Weeknd",
    image: "https://picsum.photos/seed/afterhours/300/300",
  },
  {
    id: "discovery",
    title: "Discovery",
    artist: "Daft Punk",
    image: "https://picsum.photos/seed/discovery/300/300",
  },
  {
    id: "igor",
    title: "IGOR",
    artist: "Tyler, The Creator",
    image: "https://picsum.photos/seed/igor/300/300",
  },
  {
    id: "melodrama",
    title: "Melodrama",
    artist: "Lorde",
    image: "https://picsum.photos/seed/melodrama/300/300",
  },
  {
    id: "currents",
    title: "Currents",
    artist: "Tame Impala",
    image: "https://picsum.photos/seed/currents/300/300",
  },
  {
    id: "channel-orange",
    title: "Channel Orange",
    artist: "Frank Ocean",
    image: "https://picsum.photos/seed/channelorange/300/300",
  },
  {
    id: "good-kid-maad-city",
    title: "good kid, m.A.A.d city",
    artist: "Kendrick Lamar",
    image: "https://picsum.photos/seed/gkmc/300/300",
  },
  {
    id: "yeezus",
    title: "Yeezus",
    artist: "Kanye West",
    image: "https://picsum.photos/seed/yeezus/300/300",
  },

  {
    id: "the-dark-side",
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    image: "https://picsum.photos/seed/darkside/300/300",
  },
  {
    id: "abbey-road",
    title: "Abbey Road",
    artist: "The Beatles",
    image: "https://picsum.photos/seed/abbeyroad/300/300",
  },
  {
    id: "rumours",
    title: "Rumours",
    artist: "Fleetwood Mac",
    image: "https://picsum.photos/seed/rumours/300/300",
  },
  {
    id: "thriller",
    title: "Thriller",
    artist: "Michael Jackson",
    image: "https://picsum.photos/seed/thriller/300/300",
  },
  {
    id: "purple-rain",
    title: "Purple Rain",
    artist: "Prince",
    image: "https://picsum.photos/seed/purplerain/300/300",
  },

  {
    id: "in-rainbows",
    title: "In Rainbows",
    artist: "Radiohead",
    image: "https://picsum.photos/seed/inrainbows/300/300",
  },
  {
    id: "ok-computer",
    title: "OK Computer",
    artist: "Radiohead",
    image: "https://picsum.photos/seed/okcomputer/300/300",
  },
  {
    id: "kid-a",
    title: "Kid A",
    artist: "Radiohead",
    image: "https://picsum.photos/seed/kida/300/300",
  },
  {
    id: "graduation",
    title: "Graduation",
    artist: "Kanye West",
    image: "https://picsum.photos/seed/graduation/300/300",
  },
  {
    id: "late-registration",
    title: "Late Registration",
    artist: "Kanye West",
    image: "https://picsum.photos/seed/latereg/300/300",
  },

  {
    id: "born-to-die",
    title: "Born to Die",
    artist: "Lana Del Rey",
    image: "https://picsum.photos/seed/borntodie/300/300",
  },
  {
    id: "norman-rockwell",
    title: "Norman F***ing Rockwell!",
    artist: "Lana Del Rey",
    image: "https://picsum.photos/seed/nfr/300/300",
  },
  {
    id: "ultraviolence",
    title: "Ultraviolence",
    artist: "Lana Del Rey",
    image: "https://picsum.photos/seed/ultraviolence/300/300",
  },

  {
    id: "house-of-balloons",
    title: "House of Balloons",
    artist: "The Weeknd",
    image: "https://picsum.photos/seed/houseofballoons/300/300",
  },
  {
    id: "starboy",
    title: "Starboy",
    artist: "The Weeknd",
    image: "https://picsum.photos/seed/starboy/300/300",
  },

  {
    id: "my-beautiful-dark",
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    image: "https://picsum.photos/seed/mbdtf/300/300",
  },
  {
    id: "watch-the-throne",
    title: "Watch the Throne",
    artist: "Jay-Z & Kanye West",
    image: "https://picsum.photos/seed/watchthethrone/300/300",
  },

  {
    id: "blue",
    title: "Blue",
    artist: "Joni Mitchell",
    image: "https://picsum.photos/seed/bluejoni/300/300",
  },
  {
    id: "nevermind",
    title: "Nevermind",
    artist: "Nirvana",
    image: "https://picsum.photos/seed/nevermind/300/300",
  },
  {
    id: "back-to-black",
    title: "Back to Black",
    artist: "Amy Winehouse",
    image: "https://picsum.photos/seed/backtoblack/300/300",
  },

  {
    id: "pet-sounds",
    title: "Pet Sounds",
    artist: "The Beach Boys",
    image: "https://picsum.photos/seed/petsounds/300/300",
  },
  {
    id: "low",
    title: "Low",
    artist: "David Bowie",
    image: "https://picsum.photos/seed/lowbowie/300/300",
  },
  {
    id: "heroes",
    title: "Heroes",
    artist: "David Bowie",
    image: "https://picsum.photos/seed/heroes/300/300",
  },

  {
    id: "vespertine",
    title: "Vespertine",
    artist: "Björk",
    image: "https://picsum.photos/seed/vespertine/300/300",
  },
  {
    id: "homogenic",
    title: "Homogenic",
    artist: "Björk",
    image: "https://picsum.photos/seed/homogenic/300/300",
  },

  {
    id: "random-access-memories",
    title: "Random Access Memories",
    artist: "Daft Punk",
    image: "https://picsum.photos/seed/ram/300/300",
  },
  {
    id: "sound-of-silver",
    title: "Sound of Silver",
    artist: "LCD Soundsystem",
    image: "https://picsum.photos/seed/soundofsilver/300/300",
  },
  {
    id: "this-is-happening",
    title: "This Is Happening",
    artist: "LCD Soundsystem",
    image: "https://picsum.photos/seed/thisishappening/300/300",
  },

  {
    id: "for-emma",
    title: "For Emma, Forever Ago",
    artist: "Bon Iver",
    image: "https://picsum.photos/seed/foremma/300/300",
  },
  {
    id: "22-a-million",
    title: "22, A Million",
    artist: "Bon Iver",
    image: "https://picsum.photos/seed/22amillion/300/300",
  },

  {
    id: "atlas",
    title: "Atlas",
    artist: "Real Estate",
    image: "https://picsum.photos/seed/atlas/300/300",
  },
];

export default sampleData;
