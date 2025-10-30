// Static pest data matching the Flask backend
export const PESTS = [
  {
    id: 'ants',
    name: 'Ants',
    scientificName: 'Formicidae',
    image: 'ants.jpg',
    description: 'Ants are social insects that live in colonies. Some species can damage plants by farming aphids or directly feeding on plant matter.',
    threatLevel: 'medium',
    category: 'Crawling Pest',
    symptoms: [
      'Trails of ants on plants',
      'Aphid populations increasing',
      'Damaged flower buds',
      'Soil mounds near plant base',
      'Honeydew residue on leaves'
    ],
  },
  {
    id: 'beetles',
    name: 'Beetles',
    scientificName: 'Coleoptera',
    image: 'beetles.jpg',
    description: 'Beetles are hard-shelled insects with diverse feeding habits. Many species are serious agricultural pests that damage crops at various growth stages.',
    threatLevel: 'high',
    category: 'Crawling Pest',
    symptoms: [
      'Irregular holes in leaves',
      'Skeletonized foliage',
      'Root damage',
      'Fruit scarring',
      'Wilting plants'
    ],
  },
  {
    id: 'caterpillars',
    name: 'Caterpillars',
    scientificName: 'Lepidoptera larvae',
    image: 'caterpillars.jpg',
    description: 'Caterpillars are the larval stage of butterflies and moths. They can cause extensive damage to crops through voracious feeding on leaves, stems, and fruits.',
    threatLevel: 'high',
    category: 'Larval Pest',
    symptoms: [
      'Large holes in leaves',
      'Defoliation',
      'Frass (droppings) on plants',
      'Stem boring',
      'Fruit damage'
    ],
  },
  {
    id: 'bees',
    name: 'Bees',
    scientificName: 'Apoidea',
    image: 'bees.jpg',
    description: 'Bees are essential pollinators but can occasionally damage soft fruits when foraging. Generally beneficial to agriculture.',
    threatLevel: 'low',
    category: 'Flying Pest',
    symptoms: [
      'Fruit nibbling',
      'Pollen collection',
      'Minimal crop damage',
      'Pollination activity',
      'Hive establishment'
    ],
  },
  {
    id: 'earthworms',
    name: 'Earthworms',
    scientificName: 'Lumbricina',
    image: 'earthworms.jpg',
    description: 'Earthworms are beneficial soil organisms that improve soil structure and fertility. Rarely cause any damage to crops.',
    threatLevel: 'low',
    category: 'Crawling Pest',
    symptoms: [
      'Soil castings on surface',
      'Improved soil aeration',
      'Enhanced nutrient cycling',
      'Root zone enhancement',
      'Tunneling in soil'
    ],
  },
  {
    id: 'earwigs',
    name: 'Earwigs',
    scientificName: 'Dermaptera',
    image: 'earwigs.jpg',
    description: 'Earwigs are nocturnal insects with characteristic pincers. They feed on both pests and plants, making them both beneficial and damaging.',
    threatLevel: 'medium',
    category: 'Crawling Pest',
    symptoms: [
      'Irregular holes in leaves',
      'Damaged flower petals',
      'Fruit surface damage',
      'Seedling injury',
      'Ragged leaf margins'
    ],
  },
  {
    id: 'grasshoppers',
    name: 'Grasshoppers',
    scientificName: 'Caelifera',
    image: 'grasshoppers.jpg',
    description: 'Grasshoppers are jumping insects that can cause severe damage during outbreaks. They consume large amounts of foliage and can devastate crops.',
    threatLevel: 'high',
    category: 'Flying Pest',
    symptoms: [
      'Large irregular feeding holes',
      'Complete defoliation',
      'Stem damage',
      'Crop destruction',
      'Mass feeding aggregations'
    ],
  },
  {
    id: 'moths',
    name: 'Moths',
    scientificName: 'Lepidoptera',
    image: 'moths.jpg',
    description: 'Moths are flying insects whose larvae (caterpillars) cause most of the crop damage. Adult moths primarily affect crops through egg-laying.',
    threatLevel: 'medium',
    category: 'Flying Pest',
    symptoms: [
      'Egg masses on leaves',
      'Larval feeding damage',
      'Leaf rolling',
      'Fruit boring',
      'Webbing on plants'
    ],
  },
  {
    id: 'slugs',
    name: 'Slugs',
    scientificName: 'Gastropoda',
    image: 'slugs.jpg',
    description: 'Slugs are soft-bodied mollusks that feed on a wide variety of plants. They are most active in moist conditions and at night.',
    threatLevel: 'medium',
    category: 'Soft-bodied Pest',
    symptoms: [
      'Irregular holes in leaves',
      'Slime trails',
      'Seedling destruction',
      'Fruit damage at ground level',
      'Ragged leaf edges'
    ],
  },
  {
    id: 'snails',
    name: 'Snails',
    scientificName: 'Gastropoda',
    image: 'snails.jpg',
    description: 'Snails are shelled mollusks that damage plants by feeding on leaves, stems, and fruits. They thrive in damp, shaded environments.',
    threatLevel: 'medium',
    category: 'Soft-bodied Pest',
    symptoms: [
      'Holes in leaves and fruits',
      'Silvery slime trails',
      'Seedling damage',
      'Stem scarring',
      'Nocturnal feeding damage'
    ],
  },
  {
    id: 'wasps',
    name: 'Wasps',
    scientificName: 'Hymenoptera',
    image: 'wasps.jpg',
    description: 'Wasps are predatory insects that can be both beneficial (controlling pests) and damaging (feeding on fruits). Some species are aggressive defenders of their nests.',
    threatLevel: 'medium',
    category: 'Flying Pest',
    symptoms: [
      'Fruit damage and scarring',
      'Paper nests on structures',
      'Predation on caterpillars',
      'Nectar feeding',
      'Aggressive behavior near nests'
    ],
  },
  {
    id: 'weevils',
    name: 'Weevils',
    scientificName: 'Curculionoidea',
    image: 'weevils.jpg',
    description: 'Weevils are beetles with elongated snouts that feed on various plant parts. Both adults and larvae can cause significant crop damage.',
    threatLevel: 'high',
    category: 'Crawling Pest',
    symptoms: [
      'Notched leaf edges',
      'Bud and flower damage',
      'Root feeding by larvae',
      'Grain infestation',
      'Stem boring'
    ],
  },
];

export const getThreatColor = (level) => {
  switch (level) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#1a7249';
    default:
      return '#6b7280';
  }
};

export const getThreatLabel = (level) => {
  switch (level) {
    case 'high':
      return 'High Threat';
    case 'medium':
      return 'Medium Threat';
    case 'low':
      return 'Low Threat';
    default:
      return 'Unknown Threat';
  }
};