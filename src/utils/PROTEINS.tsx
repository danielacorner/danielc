import React from "react";

const Nanoparticle_COVID_19_vaccine_candidate_50 = React.lazy(
  () =>
    import(
      "../components/GLTFs/nanotech/Nanoparticle_COVID_19_vaccine_candidate_50"
    )
);
const Protein_cage_20 = React.lazy(
  () => import("../components/GLTFs/nanotech/Protein_cage_20")
);
const Octahedral_nanoparticle_20 = React.lazy(
  () => import("../components/GLTFs/nanotech/Octahedral_nanoparticle_20")
);
const Tetrahedral_nanoparticle_20 = React.lazy(
  () => import("../components/GLTFs/nanotech/Tetrahedral_nanoparticle_20")
);
const Icosahedral_nanoparticle_20 = React.lazy(
  () => import("../components/GLTFs/nanotech/Icosahedral_nanoparticle_20")
);

export const PROTEIN_TYPES = {
  antibody: "antibody",
  nanotech: "nanotech",
  virus: "virus",
  cell: "cell",
  other: "other",
};

export type Protein = {
  /** Particle component to render */
  Component: (props: any) => JSX.Element;
  /** display name */
  name: string;
  /** if it's an antibody, it can have a virusTarget */
  virusTarget?: string;
  /** url to Protein Data Bank entry */
  PDBUrl: string;
  /** virus, antibody... */
  type: string;
  /** weight in kDA. heavier = spins less & interacts more heavily with other objects */
  mass: number;
  /** ! is this accurate, or is it in the asymmetric unit only? e.g. Faustovirus seems too light how many atoms? used to estimate particle radius */
  atomCount: number /* TECHDEBT: can find actual particleRadius instead? */;
  /** radius in Angstroms measured in ChimeraX using the Right Mouse > Distance annotation tool */
  radius: number;
  /** how big is the rendered particle compared to the actual model size */
  scale?: number;
  /** path to the model's .gltf file (unused?) */
  pathToGLTF: string;
  /** path to the high-res image of the virus */
  pathToImage: string;
  /** does the particle bump into others? (may cost more CPU) */
  interactive: boolean;
  /** PubMed Abstract text */
  pubmedAbstract: string;
  /** PubMed authors */
  authors: string;
  /** if interactive, how many faces does the geometry have?
   * determined shape for physics interactions in useConvexPolyhedron
   *
   * typically "Icosahedral" meaning 20 sides - found in the PDB entry under "Global Symmetry" */
  numIcosahedronFaces: number;
  numAsymmetricUnits: number;
};

export const PROTEINS: { [type: string]: Protein[] } = {
  nanotech: [
    {
      Component: Nanoparticle_COVID_19_vaccine_candidate_50,
      name: "Nanoparticle for a COVID-19 vaccine candidate",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/7B3Y",
      mass: 36,
      // atomCount: 99723, // PDB
      radius: 118, // measured using PDB 3d viewer e.g. https://www.rcsb.org/3d-view/6CGR/1
      atomCount: 1516,
      numIcosahedronFaces: 20,
      numAsymmetricUnits: 1,
      pathToGLTF:
        "/models/nanotech/nanoparticle_COVID_19_vaccine_candidate_50.glb",
      pathToImage:
        "/models/nanotech/nanoparticle_COVID_19_vaccine_candidate.webp",
      interactive: true,
      authors:
        "Tiong, K.T., Rijal, P., Rahikainen, R., Keeble, A.H., Schimanski, L., Hussain, S., Harvey, R., Duyvesteyn, H.M.E., Hayes, J.W.P., Edwards, J.C., McLean, R.K., Martini, V., Pedrera, M., Thakur, N., Conceicao, C., Dietrich, I., Shelton, H., Ludi, A., Wilsden, G., Browning, C., Zagrajek, A.K., Bialy, D., Bhat, S., Stevenson-Leggett, P., Hollinghurst, P., Tully, M., Moffat, K., Chiu, C., Waters, R., Gray, A., Azhar, M., Mioulet, V., Newman, J., Amin, A.S., Burman, A., Crossley, S., Hammond, J.A., Tchilian, E., Charleston, B., Bailey, D., Tuthill, T.J., Graham, S.P., Malinauskas, T., Huo, J., Tree, J.A., Buttigieg, K.R., Owens, R.J., Caroll, M.W., Daniels, R.S., McCauley, J.W., Huang, K.A., Stuart, D.I., Howarth, M., Townsend, A.R.",
      pubmedAbstract: "To be published.",
    },
    {
      Component:
        Self_assembling_dna_crystal_scaffold_with_rhombohedral_symmetry_6,
      name: "Self-Assembling DNA Crystal Scaffold with Rhombohedral Symmetry",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/6U40",
      mass: 13.07,
      // atomCount: 99723, // PDB
      radius: 38, // measured using PDB 3d viewer e.g. https://www.rcsb.org/3d-view/6CGR/1
      atomCount: 857,
      numIcosahedronFaces: 1,
      numAsymmetricUnits: 1,
      pathToGLTF:
        "/models/nanotech/self_assembling_dna_crystal_scaffold_with_rhombohedral_symmetry_6.glb",
      pathToImage:
        "/models/nanotech/self_assembling_dna_crystal_scaffold_with_rhombohedral_symmetry.webp",
      interactive: true,
      authors: "Simmons, C.R., MacCulloch, T., Stephanopoulos, N., Yan, H.",
      pubmedAbstract: "To be published.",
    },
    {
      Component: Protein_cage_20,
      name: "16nm protein cage",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/3VDX",
      mass: 150.79,
      atomCount: 10149,
      radius: 80,
      numIcosahedronFaces: 20,
      numAsymmetricUnits: 1,
      pathToGLTF: "/models/nanotech/protein_cage_20.glb",
      pathToImage: "/models/nanotech/protein_cage.webp",
      interactive: true,
      authors: "Lai, Y.T., Cascio, D., Yeates, T.O.",
      pubmedAbstract:
        "Designing protein molecules that will assemble into various kinds of ordered materials represents an important challenge in nanotechnology. We report the crystal structure of a 12-subunit protein cage that self-assembles by design to form a tetrahedral structure roughly 16 nanometers in diameter. The strategy of fusing together oligomeric protein domains can be generalized to produce other kinds of cages or extended materials.",
    },
    {
      Component: Octahedral_nanoparticle_20,
      name: "Octahedral nanoparticle",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/6VFI",
      mass: 36.55,
      atomCount: 2437,
      radius: 100,
      numIcosahedronFaces: 8,
      numAsymmetricUnits: 1,
      pathToGLTF: "/models/nanotech/octahedral_nanoparticle_20.glb",
      pathToImage: "/models/nanotech/octahedral_nanoparticle.webp",
      interactive: true,
      authors:
        "Ueda, G., Antanasijevic, A., Fallas, J.A., Sheffler, W., Copps, J., Ellis, D., Hutchinson, G.B., Moyer, A., Yasmeen, A., Tsybovsky, Y., Park, Y.J., Bick, M.J., Sankaran, B., Gillespie, R.A., Brouwer, P.J., Zwart, P.H., Veesler, D., Kanekiyo, M., Graham, B.S., Sanders, R.W., Moore, J.P., Klasse, P.J., Ward, A.B., King, N.P., Baker, D.",
      pubmedAbstract:
        "Multivalent presentation of viral glycoproteins can substantially increase the elicitation of antigen-specific antibodies. To enable a new generation of anti-viral vaccines, we designed self-assembling protein nanoparticles with geometries tailored to present the ectodomains of influenza, HIV, and RSV viral glycoprotein trimers. We first de novo designed trimers tailored for antigen fusion, featuring N-terminal helices positioned to match the C termini of the viral glycoproteins. Trimers that experimentally adopted their designed configurations were incorporated as components of tetrahedral, octahedral, and icosahedral nanoparticles, which were characterized by cryo-electron microscopy and assessed for their ability to present viral glycoproteins. Electron microscopy and antibody binding experiments demonstrated that the designed nanoparticles presented antigenically intact prefusion HIV-1 Env, influenza hemagglutinin, and RSV F trimers in the predicted geometries. This work demonstrates that antigen-displaying protein nanoparticles can be designed from scratch, and provides a systematic way to investigate the influence of antigen presentation geometry on the immune response to vaccination.",
    },
    {
      Component: Tetrahedral_nanoparticle_20,
      name: "Tetrahedral nanoparticle",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/6VFH",
      mass: 45.55,
      atomCount: 3082,
      radius: 75,
      numAsymmetricUnits: 5,
      numIcosahedronFaces: 5,
      pathToGLTF: "/models/nanotech/tetrahedral_nanoparticle_20.glb",
      pathToImage: "/models/nanotech/tetrahedral_nanoparticle.webp",
      interactive: true,
      authors:
        "Ueda, G., Antanasijevic, A., Fallas, J.A., Sheffler, W., Copps, J., Ellis, D., Hutchinson, G.B., Moyer, A., Yasmeen, A., Tsybovsky, Y., Park, Y.J., Bick, M.J., Sankaran, B., Gillespie, R.A., Brouwer, P.J., Zwart, P.H., Veesler, D., Kanekiyo, M., Graham, B.S., Sanders, R.W., Moore, J.P., Klasse, P.J., Ward, A.B., King, N.P., Baker, D.",
      pubmedAbstract:
        "Multivalent presentation of viral glycoproteins can substantially increase the elicitation of antigen-specific antibodies. To enable a new generation of anti-viral vaccines, we designed self-assembling protein nanoparticles with geometries tailored to present the ectodomains of influenza, HIV, and RSV viral glycoprotein trimers. We first de novo designed trimers tailored for antigen fusion, featuring N-terminal helices positioned to match the C termini of the viral glycoproteins. Trimers that experimentally adopted their designed configurations were incorporated as components of tetrahedral, octahedral, and icosahedral nanoparticles, which were characterized by cryo-electron microscopy and assessed for their ability to present viral glycoproteins. Electron microscopy and antibody binding experiments demonstrated that the designed nanoparticles presented antigenically intact prefusion HIV-1 Env, influenza hemagglutinin, and RSV F trimers in the predicted geometries. This work demonstrates that antigen-displaying protein nanoparticles can be designed from scratch, and provides a systematic way to investigate the influence of antigen presentation geometry on the immune response to vaccination.",
    },
    {
      Component: Icosahedral_nanoparticle_20,
      name: "Icosahedral nanoparticle",
      type: PROTEIN_TYPES.nanotech,
      PDBUrl: "https://www.rcsb.org/structure/6VFJ",
      mass: 32.57,
      atomCount: 2196,
      radius: 120,
      numIcosahedronFaces: 5,
      numAsymmetricUnits: 1,
      pathToGLTF: "/models/nanotech/icosahedral_nanoparticle_20.glb",
      pathToImage: "/models/nanotech/icosahedral_nanoparticle.webp",
      interactive: true,
      authors:
        "Ueda, G., Antanasijevic, A., Fallas, J.A., Sheffler, W., Copps, J., Ellis, D., Hutchinson, G.B., Moyer, A., Yasmeen, A., Tsybovsky, Y., Park, Y.J., Bick, M.J., Sankaran, B., Gillespie, R.A., Brouwer, P.J., Zwart, P.H., Veesler, D., Kanekiyo, M., Graham, B.S., Sanders, R.W., Moore, J.P., Klasse, P.J., Ward, A.B., King, N.P., Baker, D.",
      pubmedAbstract:
        "Multivalent presentation of viral glycoproteins can substantially increase the elicitation of antigen-specific antibodies. To enable a new generation of anti-viral vaccines, we designed self-assembling protein nanoparticles with geometries tailored to present the ectodomains of influenza, HIV, and RSV viral glycoprotein trimers. We first de novo designed trimers tailored for antigen fusion, featuring N-terminal helices positioned to match the C termini of the viral glycoproteins. Trimers that experimentally adopted their designed configurations were incorporated as components of tetrahedral, octahedral, and icosahedral nanoparticles, which were characterized by cryo-electron microscopy and assessed for their ability to present viral glycoproteins. Electron microscopy and antibody binding experiments demonstrated that the designed nanoparticles presented antigenically intact prefusion HIV-1 Env, influenza hemagglutinin, and RSV F trimers in the predicted geometries. This work demonstrates that antigen-displaying protein nanoparticles can be designed from scratch, and provides a systematic way to investigate the influence of antigen presentation geometry on the immune response to vaccination.",
    },
  ],
};
